#!/usr/bin/env python3
"""Inspect or refresh BetterGrades SEO cache controls with a fixed safe scope."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen


REFERENCE = "boho-digital-services.cloudflare.primary-management"
ZONE_NAME = "bettergrades.net"
HOSTS = ("bettergrades.net", "www.bettergrades.net")
DESIRED_BROWSER_CACHE_TTL = 0
CONTROL_PATHS = (
    "/",
    "/robots.txt",
    "/sitemap.xml",
    "/favicon.ico",
    "/favicon.svg",
    "/icon-192.png",
    "/icon-512.png",
    "/apple-touch-icon.png",
    "/site.webmanifest",
)
CONTROL_URLS = tuple(f"https://{host}{path}" for host in HOSTS for path in CONTROL_PATHS)
API_BASE = "https://api.cloudflare.com/client/v4"
SECRET_ROOT = Path("/srv/local1/secrets/broker")
VAULT_PATH = SECRET_ROOT / "local1-agent-secrets.kdbx"
KEY_FILE_PATH = SECRET_ROOT / "local1-agent-secrets.keyfile"
KEEPASSXC_CLI = "/usr/bin/keepassxc-cli"
AUDIT_PATH = Path("/srv/local1/runtime/bettergrades/cloudflare-seo-control-audit.jsonl")
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


class ControlError(RuntimeError):
    """An operational failure safe to print without credential material."""


def read_management_record() -> dict[str, Any]:
    if not VAULT_PATH.is_file() or not KEY_FILE_PATH.is_file():
        raise ControlError("the encrypted broker vault is not initialized")
    try:
        result = subprocess.run(
            [
                KEEPASSXC_CLI,
                "show",
                "--quiet",
                "--no-password",
                "--key-file",
                str(KEY_FILE_PATH),
                "--show-protected",
                "--attributes",
                "Password",
                str(VAULT_PATH),
                REFERENCE,
            ],
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=30,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise ControlError("the encrypted credential backend is unavailable") from exc
    if result.returncode != 0:
        raise ControlError("the Cloudflare management credential is missing or unreadable")
    try:
        record = json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise ControlError("the Cloudflare management credential has an invalid format") from exc
    finally:
        result.stdout = ""
    if not isinstance(record, dict) or record.get("reference") != REFERENCE:
        raise ControlError("the Cloudflare credential reference does not match")
    if not isinstance(record.get("fields"), dict):
        raise ControlError("the Cloudflare credential fields are missing")
    return record


def authenticated_headers(record: dict[str, Any]) -> tuple[str, dict[str, str]]:
    fields = record.get("fields", {})
    api_token = fields.get("api_token")
    if isinstance(api_token, str):
        api_token = api_token.strip()
    if api_token is not None:
        if (
            not isinstance(api_token, str)
            or not 1 <= len(api_token) <= 512
            or any(ord(character) < 32 or ord(character) == 127 for character in api_token)
        ):
            raise ControlError("the management API token has an invalid shape")
        return "api_token", {
            "Accept": "application/json",
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json",
            "User-Agent": "BetterGrades-SEOControlRefresh/1.0",
        }

    email = fields.get("account_email")
    api_key = fields.get("global_api_key")
    if isinstance(email, str):
        email = email.strip()
    if isinstance(api_key, str):
        api_key = api_key.strip()
    if not isinstance(email, str) or not EMAIL_RE.fullmatch(email):
        raise ControlError("the Cloudflare account email is invalid")
    if (
        not isinstance(api_key, str)
        or not 1 <= len(api_key) <= 512
        or any(ord(character) < 32 or ord(character) == 127 for character in api_key)
    ):
        raise ControlError("the Cloudflare global API key has an invalid shape")
    return "global_api_key", {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "BetterGrades-SEOControlRefresh/1.0",
        "X-Auth-Email": email,
        "X-Auth-Key": api_key,
    }


def safe_error_codes(payload: Any) -> list[int]:
    if not isinstance(payload, dict) or not isinstance(payload.get("errors"), list):
        return []
    return [
        item["code"]
        for item in payload["errors"]
        if isinstance(item, dict) and isinstance(item.get("code"), int)
    ][:5]


def request_api(
    method: str,
    path: str,
    headers: dict[str, str],
    body: dict[str, Any] | None = None,
) -> Any:
    data = None if body is None else json.dumps(body, separators=(",", ":")).encode()
    request = Request(f"{API_BASE}{path}", headers=headers, data=data, method=method)
    status = 0
    payload: Any = {}
    try:
        with urlopen(request, timeout=30) as response:
            status = response.status
            payload = json.loads(response.read(2_000_000).decode("utf-8"))
    except HTTPError as exc:
        status = exc.code
        try:
            payload = json.loads(exc.read(256_000).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            payload = {}
    except (URLError, TimeoutError, OSError) as exc:
        raise ControlError("Cloudflare could not be reached from the Pi") from exc
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ControlError("Cloudflare returned an unreadable API response") from exc

    if not isinstance(payload, dict) or payload.get("success") is not True:
        raise ControlError(
            f"Cloudflare API request failed (HTTP {status}, codes {safe_error_codes(payload)})"
        )
    return payload.get("result")


def resolve_zone(headers: dict[str, str]) -> str:
    zones = request_api(
        "GET", "/zones?" + urlencode({"name": ZONE_NAME, "per_page": 5}), headers
    )
    if not isinstance(zones, list) or len(zones) != 1:
        raise ControlError("the BetterGrades Cloudflare zone was not uniquely resolved")
    zone_id = zones[0].get("id") if isinstance(zones[0], dict) else None
    if not isinstance(zone_id, str) or not zone_id:
        raise ControlError("the BetterGrades Cloudflare zone has no usable identifier")
    return zone_id


def browser_cache_ttl(zone_id: str, headers: dict[str, str]) -> int:
    setting = request_api(
        "GET",
        f"/zones/{quote(zone_id, safe='')}/settings/browser_cache_ttl",
        headers,
    )
    value = setting.get("value") if isinstance(setting, dict) else None
    if not isinstance(value, int):
        raise ControlError("Cloudflare returned an invalid Browser Cache TTL setting")
    return value


def status(headers: dict[str, str]) -> dict[str, Any]:
    zone_id = resolve_zone(headers)
    ttl = browser_cache_ttl(zone_id, headers)
    return {
        "ok": ttl == DESIRED_BROWSER_CACHE_TTL,
        "reference": REFERENCE,
        "zone": ZONE_NAME,
        "browser_cache_ttl": ttl,
        "respects_origin_cache_headers": ttl == DESIRED_BROWSER_CACHE_TTL,
        "fixed_control_url_count": len(CONTROL_URLS),
    }


def apply_controls(headers: dict[str, str]) -> dict[str, Any]:
    zone_id = resolve_zone(headers)
    before = browser_cache_ttl(zone_id, headers)
    changed = before != DESIRED_BROWSER_CACHE_TTL
    if changed:
        request_api(
            "PATCH",
            f"/zones/{quote(zone_id, safe='')}/settings/browser_cache_ttl",
            headers,
            {"value": DESIRED_BROWSER_CACHE_TTL},
        )

    after = browser_cache_ttl(zone_id, headers)
    if after != DESIRED_BROWSER_CACHE_TTL:
        raise ControlError("Cloudflare did not retain the origin-respecting cache setting")

    purge_result = request_api(
        "POST",
        f"/zones/{quote(zone_id, safe='')}/purge_cache",
        headers,
        {"files": list(CONTROL_URLS)},
    )
    purge_id = purge_result.get("id") if isinstance(purge_result, dict) else None
    if not isinstance(purge_id, str) or not purge_id:
        raise ControlError("Cloudflare accepted the purge without a verifiable result identifier")

    return {
        "ok": True,
        "reference": REFERENCE,
        "zone": ZONE_NAME,
        "browser_cache_ttl_before": before,
        "browser_cache_ttl_after": after,
        "setting_changed": changed,
        "respects_origin_cache_headers": True,
        "purged_url_count": len(CONTROL_URLS),
        "purge_id": purge_id,
    }


def audit(action: str, outcome: str, details: dict[str, Any]) -> None:
    AUDIT_PATH.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    AUDIT_PATH.parent.chmod(0o700)
    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event": "bettergrades_cloudflare_seo_control_refresh",
        "action": action,
        "reference": REFERENCE,
        "zone": ZONE_NAME,
        "outcome": outcome,
        "browser_cache_ttl_before": details.get("browser_cache_ttl_before"),
        "browser_cache_ttl_after": details.get("browser_cache_ttl_after"),
        "setting_changed": details.get("setting_changed"),
        "purged_url_count": details.get("purged_url_count", 0),
        "purge_id": details.get("purge_id"),
    }
    fd = os.open(AUDIT_PATH, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o600)
    with os.fdopen(fd, "a", encoding="utf-8") as stream:
        stream.write(json.dumps(event, separators=(",", ":"), ensure_ascii=True) + "\n")
    AUDIT_PATH.chmod(0o600)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("status", "apply"))
    args = parser.parse_args()

    record: dict[str, Any] = {}
    headers: dict[str, str] = {}
    details: dict[str, Any] = {}
    try:
        record = read_management_record()
        auth_kind, headers = authenticated_headers(record)
        authentication_path = "/user/tokens/verify" if auth_kind == "api_token" else "/user"
        request_api("GET", authentication_path, headers)
        details = status(headers) if args.action == "status" else apply_controls(headers)
        audit(args.action, "succeeded", details)
        print(json.dumps(details, indent=2, sort_keys=True))
        return 0 if details.get("ok") else 1
    except ControlError as exc:
        audit(args.action, "failed", details)
        print(json.dumps({"ok": False, "reference": REFERENCE, "error": str(exc)}))
        return 1
    finally:
        fields = record.get("fields") if isinstance(record, dict) else None
        if isinstance(fields, dict):
            fields.clear()
        record.clear()
        headers.clear()


if __name__ == "__main__":
    raise SystemExit(main())
