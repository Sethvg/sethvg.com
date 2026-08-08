# SethVg.com

Personal site for Seth Van Grinsven — resume, game side-project portfolio, and the
hosted privacy policies the games' store listings point at.

Plain static HTML/CSS. No build step, no dependencies, no JavaScript framework.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — day job (Google / DV360) up top, games as a side project below |
| `resume.html` | Full resume. Print stylesheet included — "Print / save as PDF" gives a clean one-color document |
| `games.html` | Write-ups for all five titles, with screenshots |
| `privacy/index.html` | Index of game privacy policies |
| `privacy/grimoire.html` | Grimoire privacy policy — **this is the URL for the Play Console listing** |
| `privacy/comet-caddy.html` | Comet Caddy privacy policy |
| `css/style.css` | The only stylesheet. Colors are CSS custom properties in `:root` |
| `tools/build-privacy.py` | Regenerates the privacy pages from the games' source Markdown |
| `img/games/` | Real screenshots captured from the running builds |

## Run locally

```bash
python3 -m http.server 5210 --directory .
```

Then open http://localhost:5210.

## Privacy policies

The policies are **authored in the game repos**, not here:

- `~/AndroidStudioProjects/grimiore/games/grimoire/store/privacy-policy.md`
- `~/AndroidStudioProjects/comet-caddy/games/cometcaddy/store/privacy-policy.md`

Edit them there, then regenerate the hosted pages:

```bash
python3 tools/build-privacy.py
```

The script strips the two parts each repo deliberately does not publish — the
"Before publishing" instruction block and the Play Console **Data Safety**
worksheet — so internal notes can't leak into the public page. It reads the
"Last updated" date straight from the source, so the hosted page can't claim a
date the policy doesn't have.

Once deployed, the Play Console URL for Grimoire is
`https://sethvg.com/privacy/grimoire.html`.

**Adding a game:** append a `(source_md, output_path, display_name)` tuple to
`GAMES` in `tools/build-privacy.py`, re-run it, and add a row to the
`.policy-list` in `privacy/index.html`.

## Deploy

Any static host works. Two easy options:

**GitHub Pages** — push this directory to a repo, then Settings → Pages → deploy
from branch `main`, folder `/ (root)`. Add a `CNAME` file containing `sethvg.com`
and point an `ALIAS`/`A` record at GitHub's Pages IPs.

**Netlify / Cloudflare Pages** — drag the folder onto the dashboard, or connect
the repo with no build command and publish directory `.`.

Note: the game repos' `store/HOSTING.md` describes an older plan to host the
policy off the `Sethvg/grimiore` GitHub Pages mirror. Hosting here supersedes
that — update the URL in those docs when you deploy.

## Updating

- **New game:** copy a `.game-card` block in `index.html` and an
  `<article class="entry">` block in `games.html`. Drop screenshots in `img/games/`.
- **Screenshots:** portrait phone captures are capped at 400px tall by `.gallery img`.
  Landscape key art should use `<figure class="wide">` instead.
- **Colors:** change the custom properties in `:root` at the top of `css/style.css`.

## Open questions

Flagged rather than guessed — see the conversation that produced this site:

- **Education year.** The 2015 resume said BS, expected Dec 2015; the 2025 resume says
  BA, graduated 2013. `resume.html` currently lists the degree with no year.
- **Location.** Header says Seattle, WA, inferred from recent volunteering entries.
  The GitHub profile still says Chico, CA.
- **Phone number.** On the PDF resume, deliberately left off the public page.
- **References.** The PDF lists six referees with emails and phone numbers. Left off —
  publishing other people's contact details isn't yours to do. Page says
  "available on request".
