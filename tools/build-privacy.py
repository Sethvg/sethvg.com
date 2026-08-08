#!/usr/bin/env python3
"""Regenerate the hosted privacy policy pages from each game's source Markdown.

The policies are authored and version-controlled inside the game repos. This script
renders them into the site's styling so the two can never drift: edit the policy in
the game repo, re-run this, redeploy.

Deliberately NOT published (matching each repo's own privacy-policy.html):
  - the "> Before publishing:" instruction blockquote
  - everything from the "## Play Console — Data Safety answers" heading onward

Usage:
    python3 tools/build-privacy.py
"""

import html
import os
import re
import sys

REPOS = os.path.expanduser("~/AndroidStudioProjects")
SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# (source markdown, output file, display name)
GAMES = [
    (f"{REPOS}/grimiore/games/grimoire/store/privacy-policy.md",
     "privacy/grimoire.html", "Grimoire"),
    (f"{REPOS}/comet-caddy/games/cometcaddy/store/privacy-policy.md",
     "privacy/comet-caddy.html", "Comet Caddy"),
]

TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{game} — Privacy Policy</title>
<meta name="description" content="Privacy policy for {game}, a mobile game by Pixel Forge (Seth Van Grinsven).">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../css/style.css">
</head>
<body>

<header class="site-header">
  <div class="wrap">
    <a class="brand" href="../index.html">SethVg<span class="dot">.</span>com</a>
    <nav class="nav">
      <a href="../index.html">Home</a>
      <a href="../resume.html">Resume</a>
      <a href="../games.html">Games</a>
      <a href="index.html" aria-current="page">Privacy</a>
    </nav>
  </div>
</header>

<main>
  <div class="wrap">
    <section class="hero" style="padding-bottom:8px">
      <div class="eyebrow">Privacy policy</div>
      <h1>{game}</h1>
      <div class="updated">Last updated: {updated}</div>
    </section>

    <section class="section" style="padding-top:0;border-top:0">
      <div class="prose">
{body}
      </div>
    </section>
  </div>
</main>

<footer class="site-footer">
  <div class="wrap">
    <div>© 2026 Seth Van Grinsven · Pixel Forge</div>
    <div><a href="index.html">All game privacy policies</a></div>
  </div>
</footer>

</body>
</html>
"""


def inline(text):
    text = html.escape(text, quote=False)
    text = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)", r'<a href="\2">\1</a>', text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<![\w*])\*([^*]+)\*(?![\w*])", r"<em>\1</em>", text)
    text = re.sub(r'(?<!["\>])(https?://[^\s<]+)', r'<a href="\1">\1</a>', text)
    text = re.sub(
        r"(?<!\">)\b([\w.+-]+@[\w-]+\.[\w.]+)\b", r'<a href="mailto:\1">\1</a>', text
    )
    return text


def convert(md):
    md = re.sub(r"^> .*(?:\n> .*)*\n?", "", md, flags=re.M)  # internal instructions
    md = md.split("## Play Console")[0]                       # Data Safety worksheet
    md = re.sub(r"^\*\*Last updated:.*$", "", md, flags=re.M)  # shown in the header

    out, para, in_list = [], [], False

    def flush_para():
        if para:
            out.append("<p>" + inline(" ".join(para)) + "</p>")
            para.clear()

    def close_list():
        nonlocal in_list
        if in_list:
            out.append("</ul>")
            in_list = False

    for raw in md.split("\n"):
        line = raw.strip()
        if not line or line == "---":
            flush_para(); close_list(); continue
        if line.startswith("# "):
            continue                                          # title is in the header
        if line.startswith(("## ", "### ")):
            flush_para(); close_list()
            level, text = ("h2", line[3:]) if line.startswith("## ") else ("h3", line[4:])
            out.append(f"<{level}>{inline(text)}</{level}>")
            continue
        if line.startswith("- "):
            flush_para()
            if not in_list:
                out.append("<ul>"); in_list = True
            out.append("<li>" + inline(line[2:]) + "</li>")
            continue
        close_list()
        para.append(line)

    flush_para(); close_list()
    return "\n".join("        " + line for line in out)


def main():
    failed = False
    for src, dest, game in GAMES:
        if not os.path.exists(src):
            print(f"MISSING  {src}", file=sys.stderr)
            failed = True
            continue
        md = open(src).read()
        match = re.search(r"\*\*Last updated:\s*([^*]+)\*\*", md)
        if not match:
            print(f"NO DATE  {src}", file=sys.stderr)
            failed = True
            continue
        out_path = os.path.join(SITE, dest)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w") as fh:
            fh.write(TEMPLATE.format(
                game=game, updated=match.group(1).strip(), body=convert(md)))
        print(f"wrote    {dest}  ({game}, updated {match.group(1).strip()})")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
