#!/usr/bin/env python3
"""Append or update a paper entry in data/papers.json.

This helper is intentionally dependency-free so it can be called by a future Codex Skill
or a simple shell workflow.
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import date
from pathlib import Path
from typing import Any


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "paper"


def load_data(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"version": 1, "updatedAt": date.today().isoformat(), "papers": []}
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, list):
        data = {"version": 1, "updatedAt": date.today().isoformat(), "papers": data}
    if "papers" not in data or not isinstance(data["papers"], list):
        raise ValueError(f"Invalid {path}: expected array or object with papers array")
    return data


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Add/update one Paper Atlas entry.")
    parser.add_argument("--data", default="data/papers.json", help="Path to papers.json")
    parser.add_argument("--id", required=True, help="Unique ID, e.g. arXiv ID")
    parser.add_argument("--title", required=True, help="English/title as shown in index")
    parser.add_argument("--title-zh", default="", help="Chinese title or short translation")
    parser.add_argument("--authors", default="", help="Comma-separated authors")
    parser.add_argument("--year", type=int, default=date.today().year)
    parser.add_argument("--venue", default="arXiv")
    parser.add_argument("--category", default="Uncategorized")
    parser.add_argument("--tag", action="append", default=[], help="Repeatable tag")
    parser.add_argument("--status", default="精读", choices=["待读", "略读", "精读", "复现中", "已复现", "归档"])
    parser.add_argument("--priority", type=int, default=3)
    parser.add_argument("--summary", default="")
    parser.add_argument("--takeaway", action="append", default=[], help="Repeatable takeaway")
    parser.add_argument("--arxiv-id", default="")
    parser.add_argument("--paper-url", default="")
    parser.add_argument("--pdf-url", default="")
    parser.add_argument("--code-url", default="")
    parser.add_argument("--slug", default="", help="Folder under papers/<slug>/; defaults to title slug")
    parser.add_argument("--page-url", default="", help="Defaults to papers/<slug>/index.html")
    parser.add_argument("--reading-date", default=date.today().isoformat())
    parser.add_argument("--updated-at", default=date.today().isoformat())
    parser.add_argument("--repro", action="store_true", help="Mark reproducibility notes available")
    parser.add_argument("--repro-level", default="unknown", choices=["unknown", "low", "medium", "high"])
    parser.add_argument("--repro-notes", default="")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    data_path = Path(args.data)
    data = load_data(data_path)
    slug = args.slug or slugify(args.title)
    entry = {
        "id": args.id,
        "slug": slug,
        "title": args.title,
        "titleZh": args.title_zh,
        "authors": [a.strip() for a in args.authors.split(",") if a.strip()],
        "year": args.year,
        "venue": args.venue,
        "category": args.category,
        "tags": args.tag,
        "status": args.status,
        "priority": max(0, min(5, args.priority)),
        "readingDate": args.reading_date,
        "updatedAt": args.updated_at,
        "summary": args.summary,
        "takeaways": args.takeaway,
        "arxivId": args.arxiv_id or args.id,
        "paperUrl": args.paper_url,
        "pdfUrl": args.pdf_url,
        "pageUrl": args.page_url or f"papers/{slug}/index.html",
        "codeUrl": args.code_url,
        "repro": {
            "available": bool(args.repro),
            "level": args.repro_level,
            "notes": args.repro_notes,
        },
    }

    papers: list[dict[str, Any]] = data["papers"]
    replaced = False
    for i, paper in enumerate(papers):
        if paper.get("id") == args.id or paper.get("slug") == slug:
            papers[i] = entry
            replaced = True
            break
    if not replaced:
        papers.append(entry)

    data["updatedAt"] = date.today().isoformat()
    data_path.parent.mkdir(parents=True, exist_ok=True)
    with data_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    action = "Updated" if replaced else "Added"
    print(f"{action}: {entry['title']} -> {entry['pageUrl']}")


if __name__ == "__main__":
    main()
