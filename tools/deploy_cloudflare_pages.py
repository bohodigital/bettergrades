#!/usr/bin/env python3
"""Deploy and inspect the fixed Better Grades Cloudflare Pages project safely."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


REFERENCE = "boho-digital-services.cloudflare.pages-deploy"
ACCOUNT_ID = "41791497823353577cba1af7179342dd"
PROJECT = "bettergrades"
PAGES_HOST = "bettergrades-vhc.pages.dev"
DOMAINS = ("bettergrades.net", "www.bettergrades.net")
REPO_ROOT = Path("/srv/local1/repos/bettergrades")
OUTPUT_DIR = REPO_ROOT / "dist" / "pages"
SECRET_ROOT = Path("/srv/local1/secrets/broker")
VAULT_PATH = SECRET_ROOT / "local1-agent-secrets.kdbx"
KEY_FILE_PATH = SECRET_ROOT / "local1-agent-secrets.keyfile"
KEEPASSXC_CLI = "/usr/bin/keepassxc-cli"
WRANGLER = "/usr/local/bin/wrangler"
API_BASE = "https://api.cloudflare.com/client/v4"
AUDIT_PATH = Path("/srv/local1/runtime/bettergrades/cloudflare-pages-audit.jsonl")
URL_RE = re.compile(r"https://[a-z0-9-]+\.bettergrades-vhc\.pages\.dev", re.I)


class DeploymentError(RuntimeError):
    """A failure message that is safe to print."""


def read_record() -> dict[str, Any]:
    if not VAULT_PATH.is_file() or not KEY_FILE_PATH.is_file():
        raise DeploymentError("the encrypted broker vault is not initialized")
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
        raise DeploymentError("the encrypted credential backend is unavailable") from exc
    if result.returncode != 0:
        raise DeploymentError("the fixed Pages deployment credential is missing or unreadable")
    try:
        record = json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise DeploymentError("the fixed Pages credential has an invalid record format") from exc
    result.stdout = ""
    if not isinstance(record, dict) or record.get("reference") != REFERENCE:
        raise DeploymentError("the fixed Pages credential reference does not match")
    if not isinstance(record.get("fields"), dict):
        raise DeploymentError("the fixed Pages credential fields are missing")
    return record


def validated_token(record: dict[str, Any]) -> str:
    token = record.get("fields", {}).get("api_token")
    if isinstance(token, str):
        token = token.strip()
    if (
        not isinstance(token, str)
        or not 20 <= len(token) <= 512
        or any(ord(character) < 32 or ord(character) == 127 for character in token)
    ):
        raise DeploymentError("the fixed Pages API token has an invalid shape")
    return token


def api_get(path: str, token: str) -> Any:
    request = Request(
        f"{API_BASE}{path}",
        headers={
            "Accept": "application/json",
            "Authorization": f"Bearer {token}",
            "User-Agent": "BetterGrades-PagesDeploy/1.0",
        },
        method="GET",
    )
    try:
        with urlopen(request, timeout=30) as response:
            payload = json.loads(response.read(2_000_000).decode("utf-8"))
    except HTTPError as exc:
        try:
            payload = json.loads(exc.read(256_000).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            payload = {}
        codes = [
            item.get("code")
            for item in payload.get("errors", [])
            if isinstance(item, dict) and isinstance(item.get("code"), int)
        ][:5]
        raise DeploymentError(f"Cloudflare API rejected the request ({exc.code}; codes={codes})") from exc
    except (URLError, TimeoutError, OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise DeploymentError("Cloudflare could not be read from the Pi") from exc
    if not isinstance(payload, dict) or payload.get("success") is not True:
        raise DeploymentError("Cloudflare returned an unsuccessful API response")
    return payload.get("result")


def project_status(token: str) -> dict[str, Any]:
    project = api_get(
        f"/accounts/{ACCOUNT_ID}/pages/projects/{quote(PROJECT, safe='')}", token
    )
    domains = api_get(
        f"/accounts/{ACCOUNT_ID}/pages/projects/{quote(PROJECT, safe='')}/domains",
        token,
    )
    domain_rows = domains if isinstance(domains, list) else []
    selected = {
        str(row.get("name")): {
            "status": row.get("status"),
            "validation_status": (row.get("validation_data") or {}).get("status"),
            "verification_status": (row.get("verification_data") or {}).get("status"),
        }
        for row in domain_rows
        if isinstance(row, dict) and row.get("name") in DOMAINS
    }
    return {
        "project": PROJECT,
        "subdomain": project.get("subdomain") if isinstance(project, dict) else None,
        "production_branch": (
            project.get("production_branch") if isinstance(project, dict) else None
        ),
        "domains": {domain: selected.get(domain, {"status": "missing"}) for domain in DOMAINS},
    }


def git_value(*args: str) -> str:
    result = subprocess.run(
        ["git", "-C", str(REPO_ROOT), *args],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
        check=False,
    )
    if result.returncode != 0:
        raise DeploymentError("the durable Better Grades checkout is not readable")
    return result.stdout.strip()


def require_deployable_tree() -> str:
    if git_value("branch", "--show-current") != "main":
        raise DeploymentError("deployments are allowed only from the durable main branch")
    if git_value("status", "--porcelain"):
        raise DeploymentError("the durable Better Grades checkout is not clean")
    sha = git_value("rev-parse", "HEAD")
    for required in (OUTPUT_DIR / "_worker.js", OUTPUT_DIR / "_routes.json", OUTPUT_DIR / "assets"):
        if not required.exists():
            raise DeploymentError(f"the verified Pages output is missing {required.name}")
    return sha


def scrub(text: str, token: str) -> str:
    return text.replace(token, "[redacted]") if token else text


def deploy(token: str) -> dict[str, Any]:
    sha = require_deployable_tree()
    environment = os.environ.copy()
    environment.update(
        {
            "CLOUDFLARE_API_TOKEN": token,
            "CLOUDFLARE_ACCOUNT_ID": ACCOUNT_ID,
            "WRANGLER_SEND_METRICS": "false",
            "CI": "true",
        }
    )
    command = [
        WRANGLER,
        "pages",
        "deploy",
        str(OUTPUT_DIR),
        "--project-name",
        PROJECT,
        "--branch",
        "main",
        "--commit-hash",
        sha,
        "--commit-message",
        f"Better Grades production {sha[:12]}",
        "--commit-dirty=false",
        "--no-bundle",
    ]
    try:
        result = subprocess.run(
            command,
            cwd=REPO_ROOT,
            env=environment,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=900,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise DeploymentError("the fixed Wrangler deployment process failed to run") from exc
    finally:
        environment["CLOUDFLARE_API_TOKEN"] = ""
        environment.clear()

    combined = scrub(f"{result.stdout}\n{result.stderr}", token)
    if result.returncode != 0:
        tail = "\n".join(combined.strip().splitlines()[-16:])[-4000:]
        raise DeploymentError(f"Wrangler rejected the Pages deployment: {tail}")
    urls = URL_RE.findall(combined)
    immutable_url = urls[-1] if urls else None
    if not immutable_url:
        raise DeploymentError("Wrangler completed without returning an immutable deployment URL")
    return {
        "ok": True,
        "reference": REFERENCE,
        "project": PROJECT,
        "git_commit": sha,
        "immutable_url": immutable_url,
        "pages_url": f"https://{PAGES_HOST}",
        "cloudflare": project_status(token),
    }


def audit(action: str, outcome: str, details: dict[str, Any]) -> None:
    AUDIT_PATH.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    AUDIT_PATH.parent.chmod(0o700)
    record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "action": action,
        "reference": REFERENCE,
        "project": PROJECT,
        "outcome": outcome,
        "git_commit": details.get("git_commit"),
        "immutable_url": details.get("immutable_url"),
    }
    fd = os.open(AUDIT_PATH, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o600)
    with os.fdopen(fd, "a", encoding="utf-8") as stream:
        stream.write(json.dumps(record, separators=(",", ":"), ensure_ascii=True) + "\n")
    AUDIT_PATH.chmod(0o600)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("status", "deploy"))
    args = parser.parse_args()

    record: dict[str, Any] = {}
    token = ""
    details: dict[str, Any] = {}
    try:
        record = read_record()
        token = validated_token(record)
        details = (
            {"ok": True, "reference": REFERENCE, "cloudflare": project_status(token)}
            if args.action == "status"
            else deploy(token)
        )
        audit(args.action, "succeeded", details)
        print(json.dumps(details, indent=2, sort_keys=True))
        return 0
    except DeploymentError as exc:
        audit(args.action, "failed", details)
        print(
            json.dumps(
                {"ok": False, "reference": REFERENCE, "error": scrub(str(exc), token)},
                sort_keys=True,
            ),
            file=sys.stderr,
        )
        return 1
    finally:
        fields = record.get("fields") if isinstance(record, dict) else None
        if isinstance(fields, dict):
            fields.clear()
        record.clear()
        token = ""


if __name__ == "__main__":
    raise SystemExit(main())
