# Editorial Style Guidelines

Writing standards for AssertAndReflect content. Apply these guidelines to all posts, guides, and reflections.

---

## 1. Tone

| Quality | Description |
|---------|-------------|
| **Thoughtful** | Consider multiple perspectives. Acknowledge nuance. Avoid snap judgments. |
| **Analytical** | Ground claims in reasoning. Show your work. Explain *why*, not just *what*. |
| **Calm** | Steady, measured voice. No urgency theater. No fear-mongering. |
| **No hype** | Resist superlatives. Avoid "revolutionary," "game-changing," "must-have." |
| **No clickbait** | Titles and openings must deliver on their promise. No bait-and-switch. |

**Example (avoid):** "You're Doing Testing WRONG — Here's the Secret That Will Change Everything"  
**Example (prefer):** "Why Defect Counts Mislead: Reframing Testing Success"

---

## 2. Writing Principles

### Testing as Confidence-Building

- Frame testing as creating **confidence**, not finding defects.
- Emphasize: release readiness, uncertainty reduction, trust.
- Avoid metrics that incentivize adversarial behavior (e.g., defect-count leaderboards).

### Risk and Systems Thinking

- Prioritize risk-based reasoning. What matters most? What could go wrong?
- Consider systems: dependencies, integrations, failure modes.
- Communicate in risk language: "We're confident in X; Y needs more validation."

### Avoid When Possible

| Avoid | Instead |
|-------|---------|
| **Listicles** | Use numbered lists only when structure genuinely helps (e.g., step-by-step guides). Prefer narrative flow. |
| **Exaggerated claims** | Use qualified language. "Often," "in many cases," "tends to." |
| **Tool-worship** | Tools are means, not ends. Focus on principles; mention tools as examples, not heroes. |

---

## 3. SEO Principles

### Clear Titles

- One clear idea per title.
- Front-load the topic. Avoid vague or clever-only titles.
- Aim for 50–60 characters when practical.

### Natural Keyword Usage

- Use target keywords where they fit naturally.
- Never stuff keywords. Readability first.
- Include variations and related terms where they add value.

### Internal Linking

- **Required:** Every post must link to at least one other relevant post or guide.
- Link when it helps the reader. Don't force links.
- Use descriptive anchor text, not "click here."

### Update Older Posts

- When publishing new content that relates to older posts, add internal links both ways.
- Revise outdated claims, examples, or tool references when you notice them.
- Treat the site as a living body of work.

---

## 4. Structural Standards

### Headings

- **One H1 per post.** The title is the H1; do not add another.
- **Logical H2/H3 hierarchy.** Don't skip levels (e.g., H2 → H4). Use H2 for major sections, H3 for subsections.
- Headings should be scannable and descriptive.

### Frontmatter

Every post must include:

```yaml
---
title: [Clear, descriptive title]
date: YYYY-MM-DD
category: [reflections | guides | strategy]
excerpt: [Meta description — 1–2 sentences, 150–160 chars ideal]
tags: ["tag-1", "tag-2", "tag-3"]
---
```

- **excerpt:** Serves as meta description. Required for SEO and previews.
- **tags:** Required. Use 2–5 relevant tags. Be consistent across similar posts.

### Tag Usage

- Use existing tags when they fit. Create new tags sparingly.
- Tags should be lowercase, hyphenated (e.g., `testing-strategy`, `risk-based-testing`).

---

## 5. Closing Philosophy

### Clarity Over Volume

- One well-argued point beats five half-developed ones.
- Cut words that don't earn their place.
- Prefer short sentences and paragraphs. Break up walls of text.

### Depth Over Trend-Chasing

- Write about what you understand deeply.
- Avoid "hot takes" for the sake of engagement.
- Evergreen content that holds up over time is more valuable than timely content that ages poorly.

---

## Quick Checklist

Before publishing, verify:

- [ ] Tone is thoughtful, analytical, calm — no hype or clickbait
- [ ] Testing framed as confidence-building; risk/systems thinking present
- [ ] No unnecessary listicles; no exaggerated claims; no tool-worship
- [ ] Clear title; natural keywords; at least one internal link
- [ ] One H1; logical H2/H3 hierarchy
- [ ] Frontmatter complete: title, date, category, excerpt, tags
- [ ] Clarity over volume; depth over trend-chasing
