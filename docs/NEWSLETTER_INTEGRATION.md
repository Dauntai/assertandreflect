# Email Subscription Integration

A minimal email subscription form appears on:
- **Homepage** (between pillars and latest posts)
- **Category pages** (guides, strategy, reflections)
- **Blog post pages** (at bottom, after related posts)

---

## Current Implementation: Buttondown

The site uses **Buttondown** by default—pure HTML form, no external scripts.

### Setup

1. **Build to a separate directory** for production so the newsletter section appears. The source files use a `<!-- NEWSLETTER -->` marker that gets replaced at build time. Example: `OUT_DIR=dist node build.js`
2. Create a newsletter and obtain your **API token** (Settings → API)
3. Set the environment variable when building:

   ```bash
   BUTTONDOWN_TOKEN=your_token_here OUT_DIR=dist node build.js
   ```

   Or for production:

   ```bash
   export BUTTONDOWN_TOKEN=your_token_here
   export OUT_DIR=dist
   npm run build
   ```

4. Do **not** commit the token to git. Use your CI/CD secrets for production builds.

---

## HTML Snippet (Buttondown)

**Option A – Token-based** (current implementation, from Buttondown embed settings):

```html
<aside class="newsletter-section" aria-labelledby="newsletter-heading">
  <h2 id="newsletter-heading">Subscribe</h2>
  <p>Subscribe to receive new essays on testing, risk, and quality engineering.</p>
  <form class="newsletter-form" action="https://buttondown.com/api/v1/subscribe" method="post" target="_blank">
    <input type="hidden" name="buttondown_token" value="YOUR_TOKEN">
    <input type="email" name="email" placeholder="you@example.com" required aria-label="Email address">
    <button type="submit">Subscribe</button>
  </form>
  <p class="newsletter-privacy">No spam. Unsubscribe anytime.</p>
</aside>
```

**Option B – Username-based** (alternative from [Buttondown docs](https://docs.buttondown.com/building-your-subscriber-base)):
Replace `YOUR_USERNAME` with your Buttondown username. No token needed.

```html
<form action="https://buttondown.com/api/emails/embed-subscribe/YOUR_USERNAME" method="post">
  <input type="hidden" value="1" name="embed">
  <input type="email" name="email" placeholder="you@example.com" required>
  <button type="submit">Subscribe</button>
</form>
```

---

## Styling (main.css)

```css
.newsletter-section {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.newsletter-section p {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.newsletter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: flex-start;
  max-width: 420px;
}

.newsletter-form input[type="email"] {
  flex: 1;
  min-width: 200px;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  font-family: var(--font-sans);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
}

.newsletter-form input[type="email"]::placeholder {
  color: var(--text-muted);
}

.newsletter-form input[type="email"]:focus {
  outline: none;
  border-color: var(--accent);
}

.newsletter-form button[type="submit"] {
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  font-family: var(--font-sans);
  font-weight: 500;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.newsletter-form button[type="submit"]:hover {
  background: var(--accent);
  color: var(--bg);
  border-color: var(--accent);
}

.newsletter-privacy {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}
```

---

## Alternative: ConvertKit

1. In ConvertKit: Forms → Create Form → Inline
2. Copy the form embed code; it typically includes a script.
3. For a minimal script-free option, use their **API-based form**:

```html
<form class="newsletter-form" action="https://app.convertkit.com/forms/YOUR_FORM_ID/subscribe" method="post" target="_blank">
  <input type="hidden" name="form_id" value="YOUR_FORM_ID">
  <input type="email" name="email_address" placeholder="you@example.com" required aria-label="Email address">
  <button type="submit">Subscribe</button>
</form>
```

Replace `YOUR_FORM_ID` with your ConvertKit form ID. Update `build.js` and `site.config.js` to use `convertKitFormId` instead of `buttondownToken` if switching.

---

## Alternative: MailerLite

MailerLite’s embedded form usually requires their script. For a minimal setup:

1. In MailerLite: Campaigns → Signup forms → Embedded
2. Use their HTML embed or a custom form that posts to their API.
3. They offer a JavaScript-free “form code” option; check their docs for the current action URL and field names.

If you need a fully script-free setup, Buttondown remains the simplest choice.

---

## Summary

| Service   | Script-free | Embedded form       | Notes                        |
|----------|-------------|---------------------|------------------------------|
| Buttondown | Yes       | Pure HTML form      | Default implementation       |
| ConvertKit | Partial   | HTML + optional JS  | Inline form has minimal JS  |
| MailerLite | No        | Usually iframe/JS    | Heavier than Buttondown     |
