# Project applications on ilhaansq.com

The portfolio is the index at `/`. Each published repository also has its own
`/<repo>/` route. Repository names are used exactly, including case.

## What this change does

The portfolio keeps case studies at `/projects/<repo>/`. `/<repo>/` is reserved
for the actual application. The Nginx entrypoint can route that address to a
separate service, without an iframe, a redirect to a third-party demo host, or a
replacement UI. It forwards WebSocket upgrades, session cookies, query strings
and the full original request path. Original app code is not changed by this
portfolio repository.

When no service is connected, the static route explicitly says the live service
is not connected. This is a status page, not a working application demo. No app
is claimed to be deployed merely because its route exists.

## Connect real services using this repository

Set `DEMO_UPSTREAMS` to newline-separated mappings. Use the exact repo name and
an HTTP(S) origin with a hostname and optional port (no path or trailing slash):

```text
HRM_IlhaanSq=http://hrm:3000
ecom-akhyanbd=http://commerce:3000
chat_application_multi_room_with_django=http://chat:8000
```

These are configuration examples, not services this repository has deployed.
The services must already exist on a Docker network reachable from `portfolio`.
The portfolio Compose file intentionally does not create database or application
containers with guessed passwords, schemas or commands.

For a local Compose run, provide the variable in the environment or a private
`.env` file and run `docker compose up --build -d`. With no variable, the portfolio
continues to work and each app path shows its connection status.

## Required configuration in each original app

The proxy preserves the `/<repo>/` prefix. The upstream must serve that prefix:

- Next.js: build with `basePath: '/<repo>'`; use prefix-aware API and WebSocket
  URLs and scope authentication callback URLs/cookies to the application.
- Django: configure its script prefix/routing, static URL, CSRF trusted origins,
  allowed hosts and Channels WebSocket routes for the public path.
- Laravel: configure the public URL, asset/API routes, Sanctum domains and Reverb
  URLs for the public path. Frontend and API may need their own route prefixes.
- Flutter: build the actual web target with `--base-href /<repo>/`. An Android-only
  build cannot be made into a working web app by changing this portfolio.

A project that assumes it owns `/api`, `/login` or `/_next` cannot safely share a
site with other applications until those assumptions are fixed in its source.
The gateway deliberately does not rewrite HTML or fake those routes.

## Before marking a project live

Verify its own build, database migrations, persistence, authentication/login and
logout, deep links on reload, file uploads, static assets and WebSockets. Use
isolated demo data and demo accounts in each application's actual backend.
The screenshot files in `public/previews` are images only; they do not provide
these services. The existing `/demo/` storefront exports are browse-only and are
not used as substitutes for full deployments.

## Design

The portfolio restyle follows Hallmark's Vantage material: a dark neutral field,
restrained lime actions, plain labels and a work index led by existing real
screenshots. Search, filters, source links and case-study routes remain. The
portrait and introduction remain the owner's content. Illustrative preview
assets are not used as evidence of a working app in the project index.
