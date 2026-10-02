# Reusing this project for someone else

Everything person-specific lives in `_data/*.csv` and `assets/img/`. Nothing in
the layout, print CSS, or build scripts needs to change.

## 1. Get your own copy

Duplicate this project (or download it and start a new one from the files). Work
in the copy — the original stays intact as a reference.

## 2. Clear out the previous person

```
npm install
npm run reset-content -- --yes
```

That replaces the eight CSV tables with generic starter versions whose rows
explain what belongs in them. Then delete what is left of the old site:

- `cv-source.md` — the previous person's source CV
- `github.md` — records which repo the content came from
- `uploads/` — original uploaded files
- `assets/img/*.jpg` — replace with your own (keep the filenames, or update
  `projects.csv` and rebuild)

## 3. Fill in the tables

Open `_data/` in a spreadsheet app. Work in this order — later tables refer back
to earlier ones:

1. **`person.csv`** — name, contact, links, location.
2. **`links.csv`** — any URL you cite more than once.
3. **`blocks.csv`** — one row per job, project, degree, or publication. This is
   the real work. Write each entry *once*; every CV version reuses it.
4. **`versions.csv`** — one row per CV you want. Keep `full`, then add a
   `skillset` row per audience. `group` controls where it shows:
   `full` and `skillset` on the public page, `private` only in the CV library.
5. **`sections.csv`** — one row per section of each version, in order. The
   `content` column names ids from `blocks.csv`.
6. **`projects.csv`**, **`site.csv`**, **`outreach.csv`** — the public page and
   the cold-email template.

Two separators inside a cell: ` | ` between repeated values, ` :: ` between a
label and its value. Save as **UTF-8 CSV** so dashes and accents survive.

## 4. Build and look at it

```
npm run build      # regenerates index.html, resumes.html, cv/*.html, outreach/
npm run pdfs       # renders every version to assets/pdfs/
```

## 5. Make it yours visually

- **Accent color** — one variable at the top of `assets/css/main.css`:
  `--cv-accent` and `--cv-accent-deep`. Everything else follows.
- **Site title and description** — `_config.yml`.
- **Page order** — the `section_order` row in `site.csv`.
- **Dropping a section** — remove its name from `section_order`. To drop the
  teaching block, remove `teaching`.

## 6. Publish

Push to a GitHub repo, then Settings → Pages → source: your default branch, root.
For the PDFs to rebuild automatically, also enable Settings → Actions → General →
Workflow permissions → **Read and write**.

All internal links are relative, so the site works at either
`username.github.io` or `username.github.io/repo-name`.

## What each page is for

- `index.html` — the public one-page site. Shows the full CV plus a few
  skillset versions; no PDF links, so nothing can 404 in front of an employer.
- `resumes.html` — a private library of every version with PDF downloads.
  Unlinked and `noindex`; reachable only by typing the URL.
- `cv/*.html` — one page per version, print-optimized.
- `outreach/indie-email.html` — a cold-email template.
