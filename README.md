# ⚡ Developer Portfolio

A modern, dark-themed portfolio built with **Next.js 14 (App Router)** + **Tailwind CSS** + **Framer Motion**. Your projects are pulled **live from the GitHub API at build time** and the whole site deploys to **GitHub Pages** automatically on every push.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8) ![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222)

---

## 1. Make it yours (the only file you must edit)

Open [`src/config.ts`](src/config.ts) and set your details. The most important line:

```ts
github: {
  username: 'your-github-username', // 👈 your repos load from here
  featured: ['repo-to-pin-first'],  // optional
  exclude: ['repo-to-hide'],        // optional
}
```

Also update `name`, `role`, `tagline`, `about`, `skills`, and the `social` links. That's it — projects, stars, languages, descriptions and live-demo links are fetched automatically.

## 2. Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

To preview the exact static build that ships to Pages:

```bash
npm run build    # outputs to ./out
npx serve out
```

> Tip: set a token locally to avoid GitHub's 60-req/hr anonymous limit:
> `GITHUB_TOKEN=ghp_xxx npm run build`

## 3. Deploy to GitHub Pages (automatic)

1. Create a repo on GitHub and push this project:
   ```bash
   git add -A
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source: `GitHub Actions`**.
3. Done. The included workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) builds and publishes on every push to `main`. Your site goes live at:
   - **Project page:** `https://<you>.github.io/<repo>/`
   - **User page:** name the repo `<you>.github.io` for `https://<you>.github.io/`

The workflow sets the correct `basePath` for you and uses the built-in `GITHUB_TOKEN` to raise the API rate limit during the build. Re-run it any time (Actions tab → *Run workflow*) to re-sync your latest repos.

---

## How project loading works

- `src/lib/github.ts` calls `GET /users/<username>/repos` at **build time**.
- Forks and archived repos are hidden by default (toggle in config).
- Each card shows the repo's GitHub social-preview image, language, stars/forks, topics, a **Code** link, and a **Live** link when the repo has a homepage set.
- Everything degrades gracefully: if the API is unreachable the site still builds (projects section shows a hint instead of crashing).

## Project structure

```
src/
  config.ts            ← edit this
  app/
    layout.tsx · page.tsx · globals.css
  lib/github.ts        ← GitHub API fetch + shaping
  components/          ← Navbar, Hero, About, Projects, ProjectCard, Contact, Footer
.github/workflows/deploy.yml
next.config.mjs        ← static export + basePath
```
# portfolio_ofmine
