# Euristiq CV (Company Fork)

A streamlined, Markdown-first resume/CV builder. This repository is a company-tailored fork of the open-source "oh-my-cv" app, adapted for Euristiq’s internal use, with Google Sign‑In, S3 backup, admin-only styling controls, and auto-deployment to AWS Amplify.


&nbsp;

## Project Overview

- Write, preview, and export resumes using Markdown.
- Integrated Google authentication for secure access.
- Automatic cloud backup to Amazon S3, using web identity federation with Google.
- Admin-only control over fonts, CSS-like layout properties, and preview styling.
- CI/CD via AWS Amplify using `amplify.yml`.

Code references:
- Auth plugin: `site/src/plugins/vue3-google-login.client.ts`
- Admin/role logic: `site/src/stores/users.ts`
- S3 backup service: `site/src/utils/storage/s3Forage.ts`
- Local+backup sync wrapper: `site/src/utils/storage/backupForage.ts`
- Nuxt runtime/config: `site/nuxt.config.ts`
- Amplify build: `amplify.yml`


&nbsp;

## Features

- __Google Sign‑In__: Uses `vue3-google-login` with client ID from runtime config. See `site/src/plugins/vue3-google-login.client.ts` and `site/nuxt.config.ts` (`runtimeConfig.public.googleClientId`).
- __Markdown Support__: Write your resume in Markdown with real-time preview, cross‑refs, KaTeX, and more (see packages linked via Vite aliases in `site/nuxt.config.ts`).
- __CSS Configuration (Admin only)__: Fonts, theme colors, margins, line height, etc. are restricted to admins in `site/src/components/editor/toolbar/index.vue` (filters tools by `userStore.isAdmin`).
- __File Backup to S3__: Transparent backup/sync to S3 using AWS SDK v3 and Google web identity federation; see `site/src/utils/storage/s3Forage.ts` and `backupForage.ts`.
- __Auto Deployment__: One-click CI/CD on AWS Amplify using `amplify.yml` ( pnpm + Nuxt static output in `site/.output/public`).


&nbsp;

## Installation

Prerequisites:
- Node.js 18+ and Corepack (pnpm via Corepack)
- A Google OAuth Client ID (Web) for sign‑in
- Configure admin emails that should have elevated privileges

Steps:
1. Enable Corepack and install deps (from repo root):
   ```bash
   corepack enable
   corepack prepare pnpm@9.4.0 --activate
   pnpm install
   ```
2. Create environment file for the site app at `site/.env` (local dev) or set these in your environment/CI:
   ```bash
   # site/.env
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   # Comma-separated list of admin emails
   ADMIN_EMAILS=admin1@yourcompany.com,admin2@yourcompany.com
   ```
   Notes:
   - `GOOGLE_CLIENT_ID` is read by `site/src/plugins/vue3-google-login.client.ts` via `useRuntimeConfig().public.googleClientId` from `site/nuxt.config.ts`.
   - `ADMIN_EMAILS` controls admin privileges in `site/src/stores/users.ts`.
3. Run the app locally:
   ```bash
   pnpm dev
   ```
   This proxies to `pnpm --filter=site dev` and launches Nuxt.


&nbsp;

## Usage

- __Sign in with Google__: Use the Google login to start a session. Your identity token will be used for S3 access via web identity federation.
- __Create/Edit Resume__: Write Markdown and preview instantly. Export to PDF (A4/Letter). Supports KaTeX, cross‑refs, and icon libraries.
- __Backup to S3__: While authenticated, resumes are periodically synced to S3. Local data is merged with cloud data on login and at intervals (see `BackupForageDBService` in `backupForage.ts`).
- __Offline Support__: App is a PWA; changes are stored locally and synced when online.


&nbsp;

## Admin Features

Admin users (emails from `ADMIN_EMAILS`) get:
- __Styling controls__: theme colors, font family/size, margins, paragraph spacing, line height (guarded in `site/src/components/editor/toolbar/index.vue`).
- __Elevated S3 access__: Admins can list/query all users’ resume backups (prefix selection in `S3DbService.queryAll()`), enabling support tasks.


&nbsp;

## Configuration

- __Nuxt Runtime Config__: `site/nuxt.config.ts`
  - `runtimeConfig.public.googleClientId` ← `GOOGLE_CLIENT_ID`
  - `runtimeConfig.public.adminEmails` ← `ADMIN_EMAILS` (comma-separated)
- __Google Login Plugin__: `site/src/plugins/vue3-google-login.client.ts`
- __S3 Backup Service__: `site/src/utils/storage/s3Forage.ts`
  - Uses `@aws-sdk/client-s3` and `@aws-sdk/client-sts`
  - Credentials via `fromWebToken` using the Google ID token and IAM roles
  - Note: bucket/region/role ARNs are currently defined in code (see TODO to move to env)
- __Local + Cloud Sync__: `site/src/utils/storage/backupForage.ts`
- __PWA & i18n__: `site/configs/pwa.ts`, `site/configs/i18n.ts`
- __Build/Deploy__: `amplify.yml`


&nbsp;

## Deployment

This repository is set up for automatic deployment via AWS Amplify.

- __Amplify build file__: `amplify.yml`
  - Installs with pnpm and builds the site package
  - Publishes static output from `site/.output/public`
- __Environment Variables in Amplify__ (recommended):
  - `GOOGLE_CLIENT_ID`
  - `ADMIN_EMAILS`
- __Connect repo__ in Amplify Console and enable auto-deploy from your branch (e.g., `main`).
- __Optional__: Configure a custom domain and HTTPS in Amplify.


&nbsp;

## Troubleshooting & FAQs

- __Google sign‑in fails__:
  - Ensure `GOOGLE_CLIENT_ID` matches the OAuth Client configured in Google Cloud and that the domain/origin is authorized.
  - Check browser console for plugin init errors in `vue3-google-login.client.ts`.

- __I don’t see admin controls__:
  - Confirm your email is included in `ADMIN_EMAILS` and the value is correctly loaded by Nuxt (`runtimeConfig.public.adminEmails`).

- __S3 backup not working__:
  - You must be signed in (a valid Google ID token is required).
  - Verify IAM web identity federation and role trust policies for your Google Client ID. The app expects valid role ARNs (see `S3DbService`).
  - Check region/bucket names and network errors in console; ensure CORS on the S3 bucket allows the required methods.

- __Data mismatch between local and cloud__:
  - The app periodically merges local and backup data; newer `updated_at` wins. If out of sync, log out/in, ensure network connectivity, and wait for the background sync interval (default 20s).

- __Build/deploy fails in Amplify__:
  - Confirm Node and pnpm versions in `amplify.yml` align with your environment.
  - Ensure env vars are set in Amplify and that build logs show they are available at build time.

- __PDF export issues__:
  - Try a Chromium-based browser. Some print engines differ across browsers.


&nbsp;

## License

[GPL-3.0](LICENSE)
