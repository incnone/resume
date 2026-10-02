# Setup on Windows

## One-time installs

1. **Git** — https://git-scm.com/download/win (accept the defaults).
2. **Node.js LTS** — https://nodejs.org (accept the defaults).
3. Open **PowerShell** and check that both installed:
   ```
   git --version
   node --version
   ```

You don't need Ruby or Jekyll. The pages are plain HTML.

## Get the files

Download this project as a zip, unzip it to e.g. `C:\Users\Jordan\cv-site`, then:
```
cd C:\Users\Jordan\cv-site
npm install
```
(The first install downloads a headless Chrome for making PDFs, about 150 MB.)

## Edit, build, preview

1. Edit the spreadsheets in `_data\` (save as **CSV UTF-8**).
2. Rebuild the pages and PDFs:
   ```
   npm run build
   npm run pdfs
   ```
3. Preview locally:
   ```
   npx serve .
   ```
   Open the address it prints (usually http://localhost:3000). Stop it with Ctrl+C.

## Publish to GitHub Pages (first time)

1. On github.com, click **New repository** and name it `resume`. Make it
   **Public** and leave it empty (no README).
2. In PowerShell, from the project folder:
   ```
   git init
   git add .
   git commit -m "CV site"
   git branch -M main
   git remote add origin https://github.com/incnone/resume.git
   git push -u origin main
   ```
   Sign in when the browser prompts you.
3. On the repo page:
   - **Settings → Pages →** Source: *Deploy from a branch*, Branch: `main`, folder `/ (root)`, Save.
   - **Settings → Actions → General → Workflow permissions →** *Read and write*, Save.
4. After a minute or two the site is live at **https://incnone.github.io/resume/**.
   The private library is at **…/resume/resumes.html**.

## Publishing updates

```
git pull
npm run build
git add .
git commit -m "Update CV"
git push
```
Run `git pull` first every time, because the GitHub Action commits freshly
rendered PDFs back to the repo.

## Worth knowing

- `resumes.html` is unlinked and hidden from search engines, but it isn't secret.
  In a public repo anyone can find it. The phone number is on every CV, so
  it's public too.
- `uploads\` and `_ds\` are excluded from git on purpose.
