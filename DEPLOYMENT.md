# Deploying to Hostinger

This guide walks you through deploying Assert and Reflect to Hostinger using GitHub and automatic deployments.

## Prerequisites

- A [Hostinger](https://www.hostinger.com) hosting account (shared hosting or higher)
- Your code pushed to GitHub: https://github.com/Dauntai/assertandreflect.git

---

## Deployment Flow (Automatic)

When you push to the `main` branch, GitHub Actions will:

1. Build your site into the `dist/` folder
2. Push the built files to a `build` branch
3. Hostinger pulls from `build` and serves your site

---

## Step-by-Step Setup

### 1. Push Your Code to GitHub

If you haven’t already:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Dauntai/assertandreflect.git
git push -u origin main
```

### 2. Configure Git on Hostinger

1. Log in to **hPanel** (Hostinger control panel)
2. Go to **Hosting** → select your domain → **Manage**
3. Open **Advanced** → **GIT**
4. In **Create a New Repository**:
   - **Repository URL**: `https://github.com/Dauntai/assertandreflect.git`
   - **Branch**: `build`
   - **Install Path**: leave empty (uses `public_html`)
5. Click **Create repository**

### 3. Set Up Auto-Deployment

1. In the **Manage Repositories** section, click **Auto Deployment**
2. Copy the **Webhook URL**

### 4. Add Webhook to GitHub

1. On GitHub, go to **Dauntai/assertandreflect** → **Settings** → **Webhooks**
2. Click **Add webhook**
3. **Payload URL**: paste the Hostinger webhook URL
4. **Content type**: `application/x-www-form-urlencoded`
5. Choose **Just the push event**
6. Click **Add webhook**

### 5. Private Repository (if applicable)

If the repository is private:

1. In Hostinger GIT, use **Private Git Repository** and click **Generate SSH Key**
2. Copy the public key
3. On GitHub: **Settings** → **Deploy keys** → **Add deploy key**
4. Paste the key, name it `Hostinger`, leave **Allow write access** unchecked

### 6. Trigger the First Deploy

1. Push the GitHub Actions workflow and build changes:

   ```bash
   git add .
   git commit -m "Add Hostinger deployment workflow"
   git push
   ```

2. The workflow runs automatically on push to `main`.
3. Wait 1–2 minutes, then click **Deploy** in Hostinger GIT to pull from the `build` branch.

---

## Manual Deployment

If you prefer to deploy without GitHub Actions:

1. Build locally:
   ```bash
   npm run build:deploy
   ```

2. Upload the contents of the `dist/` folder to Hostinger via:
   - **File Manager** in hPanel, or
   - FTP (e.g. FileZilla) into `public_html`

---

## Updating Your Site

**With automatic deployment:**  
Push changes to `main`. GitHub Actions builds and updates the `build` branch. Hostinger will deploy on the next pull (manual or via webhook).

**Manual deploy:**  
Run `npm run build:deploy` and upload the new `dist/` contents to Hostinger.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on pages | Ensure Hostinger is pulling from the `build` branch, not `main` |
| Styling/JS broken | Check that `assets/` was uploaded and paths use `/assets/` |
| Webhook not firing | Confirm the webhook URL and that pushes go to `main` |
| Build fails in Actions | Check the Actions log; ensure `npm ci` and `npm run build:deploy` succeed locally |

---

## Production URL

Set your live URL in `site.config.js` before building:

```js
siteUrl: process.env.SITE_URL || 'https://yourdomain.com',
```

Or build with:

```bash
SITE_URL=https://yourdomain.com npm run build:deploy
```
