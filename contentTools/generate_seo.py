#!/usr/bin/env python3
"""Generate robots.txt and sitemap.xml for a local site directory."""

from __future__ import annotations

import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote, urljoin
from xml.sax.saxutils import escape

# ---------------------------------------------------------------------------
# Configuration — edit these for automation / cron / CI
# ---------------------------------------------------------------------------

# Root directory of the site to scan
DIRECTORY = Path("../")

# Public base URL of the site
BASE_URL = ""

# Where to write robots.txt and sitemap.xml (None = same as DIRECTORY)
OUTPUT = None

# File extensions to include in the sitemap (with or without leading dots)
INCLUDE_EXTENSIONS = ["html", "htm", "xhtml", "pdf", "xml", "txt"]

# Extensions to skip even if listed above
EXCLUDE_EXTENSIONS: list[str] = []

# Directory names to skip while scanning
EXCLUDE_DIRS = {".git", ".svn", "node_modules", "__pycache__", ".venv", "venv"}

# robots.txt rules
USER_AGENT = "*"
ALLOW: list[str] = []
DISALLOW = ["/cgi-bin/", "/tmp/"]
INCLUDE_SITEMAP_REF = True

# ---------------------------------------------------------------------------


def normalize_exts(exts: list[str]) -> set[str]:
    return {("." + e.lstrip(".")).lower() for e in exts}


def to_url(base_url: str, rel_path: Path) -> str:
    base = base_url if base_url.endswith("/") else base_url + "/"
    parts = [quote(part, safe="") for part in rel_path.as_posix().split("/")]
    return urljoin(base, "/".join(parts))


def collect_files(
    root: Path,
    include: set[str],
    exclude: set[str],
) -> list[tuple[Path, datetime]]:
    files: list[tuple[Path, datetime]] = []
    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        if any(part in EXCLUDE_DIRS for part in path.parts):
            continue
        if path.name in {"robots.txt", "sitemap.xml"}:
            continue
        ext = path.suffix.lower()
        if ext not in include or ext in exclude:
            continue
        mtime = datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc)
        files.append((path.relative_to(root), mtime))
    return files


def write_sitemap(path: Path, base_url: str, entries: list[tuple[Path, datetime]]) -> None:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for rel, mtime in entries:
        loc = escape(to_url(base_url, rel))
        lastmod = mtime.date().isoformat()
        lines.extend(
            [
                "  <url>",
                f"    <loc>{loc}</loc>",
                f"    <lastmod>{lastmod}</lastmod>",
                "  </url>",
            ]
        )
    lines.append("</urlset>")
    lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")


def write_robots(
    path: Path,
    base_url: str,
    user_agent: str,
    allow: list[str],
    disallow: list[str],
    include_sitemap: bool,
) -> None:
    lines = [f"User-agent: {user_agent}"]
    for rule in allow:
        lines.append(f"Allow: {rule}")
    for rule in disallow:
        lines.append(f"Disallow: {rule}")
    if include_sitemap:
        sitemap_url = to_url(base_url, Path("sitemap.xml"))
        lines.append("")
        lines.append(f"Sitemap: {sitemap_url}")
    lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    root = DIRECTORY.expanduser().resolve()
    if not root.is_dir():
        print(f"Error: not a directory: {root}", file=sys.stderr)
        return 1

    include = normalize_exts(INCLUDE_EXTENSIONS)
    exclude = normalize_exts(EXCLUDE_EXTENSIONS)
    output = (OUTPUT or DIRECTORY).expanduser().resolve()
    output.mkdir(parents=True, exist_ok=True)

    entries = collect_files(root, include, exclude)
    sitemap_path = output / "sitemap.xml"
    robots_path = output / "robots.txt"

    write_sitemap(sitemap_path, BASE_URL, entries)
    write_robots(
        robots_path,
        BASE_URL,
        USER_AGENT,
        ALLOW,
        DISALLOW,
        include_sitemap=INCLUDE_SITEMAP_REF,
    )

    print(f"Scanned:  {root}")
    print(f"Included: {len(entries)} file(s) ({', '.join(sorted(include - exclude))})")
    print(f"Wrote:    {robots_path}")
    print(f"Wrote:    {sitemap_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
