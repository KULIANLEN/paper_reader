#!/usr/bin/env python3
"""Upsert one paper record into data/papers.json.

This helper is intentionally independent from any Codex Skill. Later, a Skill can
call it after generating papers/<slug>/index.html.
"""
from __future__ import annotations

import argparse
import json
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

REQUIRED = {"id", "title", "category", "tags", "status", "html"}
VALID_STATUS = {"queued", "reading", "done", "skimmed", "待读", "已精读", "精读", "复现中", "已复现", "复现完成"}


def load_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"schemaVersion": "0.1.0", "generatedAt": "", "categories": [], "papers": []}
    return json.loads(path.read_text(encoding="utf-8"))


def validate_record(record: dict[str, Any]) -> None:
    missing = sorted(REQUIRED - record.keys())
    if missing:
        raise SystemExit(f"Missing required fields: {', '.join(missing)}")
    if record["status"] not in VALID_STATUS:
        raise SystemExit(f"Invalid status: {record['status']}. Expected one of {sorted(VALID_STATUS)}")
    if not isinstance(record.get("tags"), list):
        raise SystemExit("Field 'tags' must be a list of strings")
    record.setdefault("dateAdded", date.today().isoformat())
    record.setdefault("priority", "medium")


def upsert(manifest: dict[str, Any], record: dict[str, Any]) -> dict[str, Any]:
    validate_record(record)
    papers = manifest.setdefault("papers", [])
    old_len = len(papers)
    papers[:] = [paper for paper in papers if paper.get("id") != record["id"]]
    papers.append(record)
    papers.sort(key=lambda paper: (paper.get("dateAdded", ""), paper.get("title", "")), reverse=True)
    manifest["generatedAt"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    if len(papers) == old_len:
        print(f"Updated paper: {record['id']}")
    else:
        print(f"Inserted paper: {record['id']}")
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", default="data/papers.json", help="Path to papers manifest")
    parser.add_argument("--record", "--paper", required=True, help="Path to one paper JSON record")
    parser.add_argument("--indent", type=int, default=2)
    args = parser.parse_args()

    manifest_path = Path(args.manifest)
    record_path = Path(args.record)
    manifest = load_json(manifest_path)
    record = json.loads(record_path.read_text(encoding="utf-8"))
    updated = upsert(manifest, record)
    manifest_path.write_text(json.dumps(updated, ensure_ascii=False, indent=args.indent) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
