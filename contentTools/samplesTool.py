#!/usr/bin/env python3
"""Scan sample directories and generate selection.html."""
#Created using AI going to be used as template then manually reworked to suite project use.

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "../pages/codeEmulators/selection.html"

# (folder name, title, extensions, how to link)
SECTIONS = [
    {
        "dir": "../pages/codeEmulators/LuaSamples",
        "title": "Lua Samples",
        "extensions": {".lua"},
        "kind": "lua",
    },
    {
        "dir": "../pages/codeEmulators/PythonSamples",
        "title": "Python Samples",
        "extensions": {".py"},
        "kind": "python",
    },
    {
        "dir": "../pages/codeEmulators/ThreeSamples",
        "title": "Three.js Samples",
        "extensions": {".js"},
        "kind": "three",
    },
    {
        "dir": "../pages/codeEmulators/PixiJSSamples",
        "title": "Pixi.js Samples",
        "extensions": {".js"},
        "kind": "pixi",
    },
    {
        "dir": "../pages/codeEmulators/JavascriptSamples",
        "title": "Javascript Samples",
        "extensions": {".js"},
        "kind": "javascript",
    },
]


def collect_files(section: dict) -> list[Path]:
    folder = ROOT / section["dir"]
    if not folder.is_dir():
        return []

    files: list[Path] = []
    for path in sorted(folder.rglob("*")):
        if path.is_file() and path.suffix.lower() in section["extensions"]:
            files.append(path)
    return files


def href_for(section: dict, path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    stem = path.stem

    commonPath = "/pages/codeEmulators/"

    match section["kind"].lower():
        case "lua":
            nested = path.relative_to(ROOT / section["dir"]).with_suffix("").as_posix()
            return f"{commonPath}luaEditor.html#{nested}"

        case "python":
            nested = path.relative_to(ROOT / section["dir"]).with_suffix("").as_posix()
            return f"{commonPath}pythonEditor.html#{nested}"

        case "three":
            nested = path.relative_to(ROOT / section["dir"]).with_suffix("").as_posix()
            return f"{commonPath}threeEditor.html#{nested}"

        case "pixi":
            nested = path.relative_to(ROOT / section["dir"]).with_suffix("").as_posix()
            return f"{commonPath}pixiEditor.html#{nested}"

        case "javascript":
            nested = path.relative_to(ROOT / section["dir"]).with_suffix("").as_posix()
            return f"{commonPath}javascriptEditor.html#{nested}"

    return rel


def label_for(section: dict, path: Path) -> str:
    return path.relative_to(ROOT / section["dir"]).as_posix()


def render_section(section: dict) -> str:
    files = collect_files(section)
    items = []

    if not files:
        items.append('<li class="empty">No samples found</li>')
    else:
        for path in files:
            href = href_for(section, path)
            label = label_for(section, path)
            items.append(
                f'<li><a href="{href}">{label}</a>'
                f'<span class="ext">{path.suffix}</span></li>'
            )

    return f"""
    <section class="section" data-kind="{section['kind']}">
      <h2>{section['title']}</h2>
      <p class="path">/{section['dir']}/</p>
      <ul>
        {"".join(items)}
      </ul>
    </section>
"""


def generate() -> str:
    sections_html = "\n".join(render_section(s) for s in SECTIONS)
    total = sum(len(collect_files(s)) for s in SECTIONS)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Sample Selection</title>
<style>
* {{
    box-sizing: border-box;
}}

body {{
    margin: 0;
    min-height: 100vh;
    background: #272727;
    color: #d4d4d4;
    font-family: monospace;
}}

header {{
    padding: 14px 18px;
    background: #1e1e1e;
    border-bottom: 1px solid #3a3a3a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}}

header h1 {{
    margin: 0;
    font-size: 16px;
    font-weight: normal;
    color: #fff;
}}

header .meta {{
    color: #888;
    font-size: 13px;
}}

a.nav {{
    color: #7bdff2;
    text-decoration: none;
}}

a.nav:hover {{
    text-decoration: underline;
}}

main {{
    max-width: 960px;
    margin: 0 auto;
    padding: 24px 18px 48px;
    display: grid;
    gap: 20px;
}}

.section {{
    background: #1e1e1e;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    padding: 16px 18px 8px;
}}

.section h2 {{
    margin: 0 0 4px;
    font-size: 15px;
    color: #fff;
    font-weight: normal;
}}

.section .path {{
    margin: 0 0 12px;
    color: #888;
    font-size: 12px;
}}

ul {{
    list-style: none;
    margin: 0;
    padding: 0;
}}

li {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 4px;
    border-top: 1px solid #333;
}}

li.empty {{
    color: #888;
    border-top: none;
}}

li a {{
    color: #4c6ef5;
    text-decoration: none;
}}

li a:hover {{
    color: #748ffc;
    text-decoration: underline;
}}

.ext {{
    color: #666;
    font-size: 12px;
}}

.section[data-kind="lua"] li a {{ color: #7CFC98; }}
.section[data-kind="python"] li a {{ color: #ffd166; }}
.section[data-kind="three"] li a {{ color: #7bdff2; }}
</style>
</head>
<body>

<header>
    <h1>Sample Selection</h1>
    <div class="meta">{total} sample(s) · generated using internal tools.</div>
</header>

<main>
{sections_html}
</main>

</body>
</html>
"""


def main() -> None:
    html = generate()
    OUTPUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size} bytes)")

    for section in SECTIONS:
        files = collect_files(section)
        print(f"  {section['dir']}: {len(files)} file(s)")
        for path in files:
            print(f"    - {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()