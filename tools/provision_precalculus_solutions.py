#!/usr/bin/env python3
"""Provision the fixed Better Grades Precalculus protected-answer KV boundary."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen


REFERENCE = "boho-digital-services.cloudflare.primary-management"
ACCOUNT_ID = "41791497823353577cba1af7179342dd"
PROJECT = "bettergrades"
BINDING = "PRECALCULUS_SOLUTIONS"
NAMESPACE_TITLE = "bettergrades-precalculus-solutions-production"
EXPECTED_RECORD_COUNT = 2_454
REPO_ROOT = Path("/srv/local1/repos/bettergrades")
SOLUTIONS_PATH = REPO_ROOT / "content/precalculus/solutions.server.json"
SECRET_ROOT = Path("/srv/local1/secrets/broker")
VAULT_PATH = SECRET_ROOT / "local1-agent-secrets.kdbx"
KEY_FILE_PATH = SECRET_ROOT / "local1-agent-secrets.keyfile"
KEEPASSXC_CLI = "/usr/bin/keepassxc-cli"
API_BASE = "https://api.cloudflare.com/client/v4"
AUDIT_PATH = Path("/srv/local1/runtime/bettergrades/precalculus-solutions-provisioning-audit.jsonl")


class ProvisioningError(RuntimeError):
    """A provisioning failure that is safe to print."""


def read_record() -> dict[str, Any]:
    if not VAULT_PATH.is_file() or not KEY_FILE_PATH.is_file():
        raise ProvisioningError("the encrypted broker vault is not initialized")
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
        raise ProvisioningError("the encrypted credential backend is unavailable") from exc
    if result.returncode != 0:
        raise ProvisioningError("the fixed Cloudflare management credential is missing or unreadable")
    try:
        record = json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise ProvisioningError("the fixed Cloudflare credential has an invalid record format") from exc
    result.stdout = ""
    if not isinstance(record, dict) or record.get("reference") != REFERENCE:
        raise ProvisioningError("the fixed Cloudflare credential reference does not match")
    if not isinstance(record.get("fields"), dict):
        raise ProvisioningError("the fixed Cloudflare credential fields are missing")
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
        raise ProvisioningError("the fixed Cloudflare API token has an invalid shape")
    return token


def api_request(
    method: str,
    path: str,
    token: str,
    payload: Any | None = None,
) -> tuple[Any, dict[str, Any]]:
    data = None if payload is None else json.dumps(payload, separators=(",", ":")).encode("utf-8")
    request = Request(
        f"{API_BASE}{path}",
        data=data,
        headers={
            "Accept": "application/json",
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "BetterGrades-PrecalculusSolutions/1.0",
        },
        method=method,
    )
    try:
        with urlopen(request, timeout=120) as response:
            envelope = json.loads(response.read(2_000_000).decode("utf-8"))
    except HTTPError as exc:
        try:
            envelope = json.loads(exc.read(256_000).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            envelope = {}
        codes = [
            item.get("code")
            for item in envelope.get("errors", [])
            if isinstance(item, dict) and isinstance(item.get("code"), int)
        ][:5]
        raise ProvisioningError(f"Cloudflare API rejected the request ({exc.code}; codes={codes})") from exc
    except (URLError, TimeoutError, OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ProvisioningError("Cloudflare could not be reached safely from the Pi") from exc
    if not isinstance(envelope, dict) or envelope.get("success") is not True:
        raise ProvisioningError("Cloudflare returned an unsuccessful API response")
    info = envelope.get("result_info")
    return envelope.get("result"), info if isinstance(info, dict) else {}


def git_value(*args: str) -> str:
    result = subprocess.run(
        ["git", "-C", str(REPO_ROOT), *args],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
        check=False,
    )
    if result.returncode != 0:
        raise ProvisioningError("the durable Better Grades checkout is not readable")
    return result.stdout.strip()


def require_deployable_tree() -> str:
    if git_value("branch", "--show-current") != "main":
        raise ProvisioningError("provisioning is allowed only from the durable main branch")
    if git_value("status", "--porcelain"):
        raise ProvisioningError("the durable Better Grades checkout is not clean")
    if not SOLUTIONS_PATH.is_file():
        raise ProvisioningError("the protected solution source is missing")
    return git_value("rev-parse", "HEAD")


def load_records() -> tuple[list[dict[str, str]], set[str]]:
    try:
        source = json.loads(SOLUTIONS_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ProvisioningError("the protected solution source is unreadable") from exc
    solutions = source.get("solutions") if isinstance(source, dict) else None
    if not isinstance(solutions, list) or len(solutions) != EXPECTED_RECORD_COUNT:
        raise ProvisioningError("the protected solution source has the wrong record count")
    keys: set[str] = set()
    records: list[dict[str, str]] = []
    for solution in solutions:
        key = solution.get("id") if isinstance(solution, dict) else None
        if not isinstance(key, str) or not key or key in keys:
            raise ProvisioningError("the protected solution source contains an invalid or duplicate ID")
        keys.add(key)
        records.append({"key": key, "value": json.dumps(solution, separators=(",", ":"), ensure_ascii=True)})
    return records, keys


def list_namespaces(token: str) -> list[dict[str, Any]]:
    result, _ = api_request(
        "GET",
        f"/accounts/{ACCOUNT_ID}/storage/kv/namespaces?{urlencode({'per_page': 1000, 'order': 'title', 'direction': 'asc'})}",
        token,
    )
    if not isinstance(result, list):
        raise ProvisioningError("Cloudflare returned an invalid KV namespace inventory")
    return [row for row in result if isinstance(row, dict)]


def find_namespace(token: str) -> dict[str, Any] | None:
    matches = [row for row in list_namespaces(token) if row.get("title") == NAMESPACE_TITLE]
    if len(matches) > 1:
        raise ProvisioningError("Cloudflare returned duplicate fixed-title KV namespaces")
    return matches[0] if matches else None


def create_namespace(token: str) -> dict[str, Any]:
    result, _ = api_request(
        "POST",
        f"/accounts/{ACCOUNT_ID}/storage/kv/namespaces",
        token,
        {"title": NAMESPACE_TITLE},
    )
    if not isinstance(result, dict) or not isinstance(result.get("id"), str):
        raise ProvisioningError("Cloudflare did not return the created KV namespace")
    return result


def list_keys(token: str, namespace_id: str) -> set[str]:
    keys: set[str] = set()
    cursor: str | None = None
    while True:
        query_values = {"limit": 1000}
        if cursor:
            query_values["cursor"] = cursor
        query = urlencode(query_values)
        result, info = api_request(
            "GET",
            f"/accounts/{ACCOUNT_ID}/storage/kv/namespaces/{quote(namespace_id, safe='')}/keys?{query}",
            token,
        )
        if not isinstance(result, list):
            raise ProvisioningError("Cloudflare returned an invalid KV key inventory")
        for row in result:
            name = row.get("name") if isinstance(row, dict) else None
            if not isinstance(name, str) or name in keys:
                raise ProvisioningError("Cloudflare returned an invalid or duplicate KV key")
            keys.add(name)
        next_cursor = info.get("cursor")
        if isinstance(next_cursor, str) and next_cursor:
            if next_cursor == cursor:
                raise ProvisioningError("Cloudflare repeated a KV pagination cursor")
            cursor = next_cursor
            continue
        return keys


def upload_records(token: str, namespace_id: str, records: list[dict[str, str]]) -> None:
    result, _ = api_request(
        "PUT",
        f"/accounts/{ACCOUNT_ID}/storage/kv/namespaces/{quote(namespace_id, safe='')}/bulk",
        token,
        records,
    )
    if isinstance(result, dict):
        unsuccessful = result.get("unsuccessful_keys")
        if isinstance(unsuccessful, list) and unsuccessful:
            raise ProvisioningError("Cloudflare rejected one or more protected KV records")
        successful = result.get("successful_key_count")
        if successful is not None and int(successful) != EXPECTED_RECORD_COUNT:
            raise ProvisioningError("Cloudflare reported an incomplete protected KV upload")


def project(token: str) -> dict[str, Any]:
    result, _ = api_request(
        "GET",
        f"/accounts/{ACCOUNT_ID}/pages/projects/{quote(PROJECT, safe='')}",
        token,
    )
    if not isinstance(result, dict):
        raise ProvisioningError("Cloudflare returned an invalid Pages project")
    return result


def binding_map(project_record: dict[str, Any], environment: str) -> dict[str, Any]:
    configs = project_record.get("deployment_configs")
    selected = configs.get(environment) if isinstance(configs, dict) else None
    bindings = selected.get("kv_namespaces") if isinstance(selected, dict) else None
    return dict(bindings) if isinstance(bindings, dict) else {}


def binding_status(project_record: dict[str, Any], namespace_id: str | None) -> dict[str, bool]:
    return {
        environment: (
            namespace_id is not None
            and isinstance(binding_map(project_record, environment).get(BINDING), dict)
            and binding_map(project_record, environment)[BINDING].get("namespace_id") == namespace_id
        )
        for environment in ("preview", "production")
    }


def bind_namespace(token: str, project_record: dict[str, Any], namespace_id: str) -> None:
    deployment_configs: dict[str, Any] = {}
    for environment in ("preview", "production"):
        bindings = binding_map(project_record, environment)
        bindings[BINDING] = {"namespace_id": namespace_id}
        deployment_configs[environment] = {"kv_namespaces": bindings}
    api_request(
        "PATCH",
        f"/accounts/{ACCOUNT_ID}/pages/projects/{quote(PROJECT, safe='')}",
        token,
        {"deployment_configs": deployment_configs},
    )


def status(token: str) -> dict[str, Any]:
    namespace = find_namespace(token)
    namespace_id = namespace.get("id") if isinstance(namespace, dict) else None
    key_count = len(list_keys(token, namespace_id)) if isinstance(namespace_id, str) else 0
    return {
        "ok": True,
        "reference": REFERENCE,
        "project": PROJECT,
        "binding": BINDING,
        "namespace_id": namespace_id,
        "namespace_title": NAMESPACE_TITLE,
        "key_count": key_count,
        "bindings": binding_status(project(token), namespace_id if isinstance(namespace_id, str) else None),
    }


def provision(token: str) -> dict[str, Any]:
    sha = require_deployable_tree()
    records, expected_keys = load_records()
    namespace = find_namespace(token) or create_namespace(token)
    namespace_id = namespace.get("id")
    if not isinstance(namespace_id, str):
        raise ProvisioningError("the fixed KV namespace has no identifier")
    upload_records(token, namespace_id, records)
    actual_keys = list_keys(token, namespace_id)
    if actual_keys != expected_keys:
        raise ProvisioningError("the protected KV key inventory does not match the canonical solution IDs")
    project_record = project(token)
    bind_namespace(token, project_record, namespace_id)
    verified_project = project(token)
    bindings = binding_status(verified_project, namespace_id)
    if not all(bindings.values()):
        raise ProvisioningError("the protected KV binding did not verify in preview and production")
    return {
        "ok": True,
        "reference": REFERENCE,
        "git_commit": sha,
        "project": PROJECT,
        "binding": BINDING,
        "namespace_id": namespace_id,
        "namespace_title": NAMESPACE_TITLE,
        "key_count": len(actual_keys),
        "bindings": bindings,
    }


def audit(action: str, outcome: str, details: dict[str, Any]) -> None:
    AUDIT_PATH.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    AUDIT_PATH.parent.chmod(0o700)
    record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "action": action,
        "reference": REFERENCE,
        "project": PROJECT,
        "binding": BINDING,
        "outcome": outcome,
        "git_commit": details.get("git_commit"),
        "namespace_id": details.get("namespace_id"),
        "key_count": details.get("key_count"),
    }
    fd = os.open(AUDIT_PATH, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o600)
    with os.fdopen(fd, "a", encoding="utf-8") as stream:
        stream.write(json.dumps(record, separators=(",", ":"), ensure_ascii=True) + "\n")
    AUDIT_PATH.chmod(0o600)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("status", "provision"))
    args = parser.parse_args()

    token = ""
    details: dict[str, Any] = {}
    try:
        token = validated_token(read_record())
        details = status(token) if args.action == "status" else provision(token)
        audit(args.action, "succeeded", details)
        print(json.dumps(details, indent=2, sort_keys=True))
        return 0
    except ProvisioningError as exc:
        audit(args.action, "failed", details)
        print(json.dumps({"ok": False, "error": str(exc)}, indent=2), file=sys.stderr)
        return 1
    finally:
        token = ""


if __name__ == "__main__":
    raise SystemExit(main())
