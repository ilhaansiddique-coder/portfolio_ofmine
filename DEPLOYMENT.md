# 🚀 Deployment Runbook

## Coolify (Docker Compose)

The repository includes `docker-compose.yaml` at its root, matching Coolify's
default `/docker-compose.yaml` location. Use branch `main`, base directory `/`,
and the **Docker Compose** build pack. After fetching the Compose file, assign
your domain to the `portfolio` service on internal port **80**, then deploy.
No host port mapping is required; Coolify's proxy routes requests to the service.

Set `NEXT_PUBLIC_BASE_URL` to your final portfolio URL before building so metadata
uses your domain. This deployment serves the existing static export with Nginx;
the contact form opens the visitor's email application. It does not run Next.js
API routes or require a database. HTML is revalidated normally; hashed Next.js
assets receive long-lived caching.

The container build skips the standalone storefront demo builds, which clone
separate repositories. Those `/demo/` pages are not included in this image.
The portfolio and project case studies are included. GitHub project data is
fetched at build time, so redeploy to refresh it.

For a local Docker verification:

```bash
docker compose -f docker-compose.yaml config
docker compose -f docker-compose.yaml build
docker compose -f docker-compose.yaml up -d
```

---

This portfolio is a **static site** → **GitHub Pages**. Your individual
projects are shown live in three ways:

1. **Static projects** → their own **GitHub Pages** URL
2. **Dynamic full-stack projects** (need a server/DB) → **Vercel** free tier
3. **Anything not deployed** → runs live **in-browser via StackBlitz** (already
   built into the portfolio — nothing to do)

When a project has a live URL, set it as the repo's **Website/homepage** on
GitHub (or add `demo:` in `src/config.ts` → `projectOverrides`), and the
portfolio automatically embeds the real running site.

---

## 1. Deploy THIS portfolio → GitHub Pages  (do this first)

The repo + workflow are ready. You just push and flip one setting.

```bash
# in this project folder, in YOUR terminal (has your GitHub login)
git push -u origin main
```

Then on GitHub:

1. Open **github.com/ilhaansiddique-coder/portfolio_ofmine → Settings → Pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions**
3. Wait ~2 min for the "Deploy to GitHub Pages" workflow (Actions tab) to finish

**Live at:** `https://ilhaansiddique-coder.github.io/portfolio_ofmine/`

> Optional, for the private-inclusive 473 contribution count: add a repo secret
> `GH_CONTRIB_TOKEN` (Settings → Secrets and variables → Actions) = a classic
> PAT with `read:user`. Without it the deployed site shows your public count.

---

## 2. Static project repos → GitHub Pages

For each **purely static / front-end** repo (theme templates, `portfolio_rehedeen`,
Flutter-web builds). Full-stack apps (HRM, auth, ecom-with-backend) will NOT
work here — use Vercel (section 3).

**Per repo:**

1. Make it a static export. In `next.config.mjs` (or `.js`):
   ```js
   const repo = 'REPO_NAME'; // e.g. yangkedu_ecom_theme_template
   const nextConfig = {
     output: 'export',
     basePath: process.env.GITHUB_ACTIONS ? `/${repo}` : '',
     images: { unoptimized: true },
     trailingSlash: true,
   };
   export default nextConfig;
   ```
2. Copy `deploy-templates/nextjs-gh-pages.yml` into that repo at
   `.github/workflows/deploy.yml`.
3. Commit + push, then **Settings → Pages → Source: GitHub Actions**.
4. Live at `https://ilhaansiddique-coder.github.io/REPO_NAME/`.
5. Set that URL as the repo's **Website** (top of the repo page) so the
   portfolio embeds it.

> If a repo's `npm run build` fails with static export, it has server-side
> features → it's actually dynamic → deploy it to Vercel instead.

---

## 3. Dynamic full-stack repos → Vercel (free)

For **HRM_IlhaanSq**, **mega_auth_nextjs_postgresql**, and any ecom app with a
backend/database. Vercel runs Next.js server code natively.

**Per repo (all in the browser, ~3 min):**

1. Go to **vercel.com/new** → **Import** the GitHub repo.
2. Add a free database if it needs one:
   - **Neon** (neon.tech) or **Supabase** → free PostgreSQL → copy the connection string.
3. In Vercel → the project → **Settings → Environment Variables**, add what the
   repo's `.env.example` lists (e.g. `DATABASE_URL`, auth secrets).
4. **Deploy**. Vercel gives a URL like `https://your-app.vercel.app`.
5. Set that URL as the repo's **Website** on GitHub → the portfolio embeds it live.

> `new_tireshop_dc` is already on Vercel (`project-1e8p4.vercel.app`) — nothing to do.

**Platform picks (from the 2026 free-tier comparison):**
- **Vercel** — best for Next.js full-stack (serverless). Personal use only.
- **Render** — good for a Dockerized backend; free web service sleeps after 15 min.
- **Cloudflare Pages** — unlimited bandwidth; best for static/edge.
- **Netlify** — fine alternative for static + functions.

---

## 4. After a project is live

Point the portfolio at it (either works):

- **Easiest:** set the repo's **Website** field on GitHub → auto-picked up on next build.
- **Or** in `src/config.ts`:
  ```ts
  projectOverrides: {
    'HRM_IlhaanSq': { demo: 'https://hrm-ilhaansq.vercel.app', /* ... */ },
  }
  ```

Push the portfolio again (or re-run its Actions workflow) to rebuild with the
new live links.
