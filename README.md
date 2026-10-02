# Jordan Watkins — CV site

A small static site (GitHub Pages / Jekyll compatible) presenting Jordan Watkins's CV
as a one-page professional webpage plus seven print-ready, role-targeted versions
and a cold-outreach email template.

## Content lives in _data/*.csv

Eight small CSV tables are the single source of truth. Each opens in Excel,
Numbers, or Google Sheets as an ordinary spreadsheet. Edit them, then:

```
npm install
npm run build     # regenerates index.html, cv/*.html, outreach/*.html
```

Shared facts (phone, a project description) exist once and appear everywhere.
Jekyll also reads these as `site.data.person`, `site.data.blocks`, and so on,
if you later want Liquid templating.

| File | One row per | Notes |
| --- | --- | --- |
| `person.csv` | contact field | name, phone, email, links, location |
| `links.csv` | external URL | referenced by id elsewhere |
| `site.csv` | chunk of page copy | about, teaching, section order, skills, education |
| `blocks.csv` | reusable CV entry | a job, project, or degree — written once, reused by any version |
| `versions.csv` | CV version | its title, summary, and where it appears (see `group`) |
| `sections.csv` | section of a version | in order; `content` names the blocks to include |
| `projects.csv` | project on the site | |
| `outreach.csv` | line of the email | |

**Two separators inside a cell:**
- ` | ` (space-pipe-space) separates repeated values — bullets, tags, block ids.
- ` :: ` separates a label from its value, e.g. `Languages :: C++, Python, SQL`.

**How a version is assembled:** `versions.csv` defines the CV; its rows in
`sections.csv` list the sections in order; each `entries` section names ids from
`blocks.csv`. To add a bullet everywhere it appears, edit one cell in `blocks.csv`.
The `group` column in `versions.csv` controls visibility: `full` and `skillset`
appear on the public page, `private` only in the CV library.

## Structure

- `index.html` — the public one-page site (generated).
- `resumes.html` — **private CV library** (generated). Not linked from the public
  site and marked `noindex`; this is where Jordan grabs copies to send out.
- `cv/` — the versions, each print-optimized (generated):
  `full` (complete CV) · `academia` · `quantitative` · `gamedev` · `phd`
  Each version's `group` in `cv.json` decides where it appears:
  `full` and `skillset` show on the public page; `private` only in the library.
- `outreach/indie-email.html` — cold-email template for small studios (generated).
- `assets/css/modernist.css` — vendored design-system tokens.
- `assets/css/main.css` — this site's styles (screen + `@media print`).
  The accent color is one variable at the top: `--cv-accent`.
- `assets/img/` — replace the placeholders; see that folder's README.
- `assets/pdfs/` — generated PDFs.
- `cv-source.md` — the original Markdown CV, kept as a record.

## Hosting on GitHub Pages

1. Push to a repo.
2. Settings → Pages → source: your default branch, root folder.
3. Pages are plain HTML, so Jekyll serves them verbatim — no build step needed on
   their side. All internal links are relative, so it works at either
   `username.github.io` or `username.github.io/repo-name`.

## PDFs

**Automatic:** `.github/workflows/build-pdfs.yml` rebuilds the pages and renders
every version to `assets/pdfs/` on each push, then commits the result. Enable write
access under Settings → Actions → General → Workflow permissions.

**Local:** `npm install && npm run build && npm run pdfs`

**Browser:** open any version and use *Print / Save as PDF*. Page geometry is owned
by the `@page` rule in `main.css`, so browser and CI output match.
