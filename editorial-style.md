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

### Images (Optional)

Images are optional. Posts render correctly with or without them. No placeholder images.

**Folder structure:** Store images under `/assets/images/posts/<post-slug>/`. Example: for post `confidence-vs-defect-counting`, use `/assets/images/posts/confidence-vs-defect-counting/diagram.svg`.

**Markdown syntax:**
```markdown
![Descriptive alt text](/assets/images/posts/<slug>/<image-name>.svg)
```

**Alt text:** Required for accessibility. Use descriptive alt text that conveys the image's meaning. Examples:
- `![Confidence vs time graph showing how testing builds confidence over time](/assets/images/posts/confidence-vs-defect-counting/diagram.svg)`
- `![Flowchart of risk-based test prioritization decisions](/assets/images/posts/risk-prioritization/flow.svg)`
- `![Screenshot of the test results dashboard with pass/fail summary](/assets/images/posts/ui-automation/dashboard.png)`

Missing alt text triggers a build warning but does not fail the build.

**Hero image (optional):** Add to frontmatter for a banner image below the title:
```yaml
heroImage: /assets/images/posts/<slug>/hero.svg
heroImageAlt: Brief description of the hero image
```

---

## 5. Image Prompt Guide

All site images must follow a **consistent visual style** so the site feels cohesive. Use this guide when creating or commissioning images (including AI-generated).

### Site Image Style

| Rule | Description |
|------|-------------|
| **Minimal** | Few elements. No clutter. Every line earns its place. |
| **Color** | Black and white only, OR a single accent color (e.g. site blue). No gradients, no multi-color palettes. |
| **Line-based** | Clean strokes, line art, diagram aesthetic. No fills, gradients, or shadows. |
| **Consistent** | Same stroke weight, same font treatment, same level of detail across all images. |
| **Small** | Optimized for web. Prefer SVG. Keep dimensions modest (e.g. hero 600×120, inline 400×200). |

**Style keywords for prompts:** minimal line art, monochrome, single color, geometric, flat, no gradients, no shadows, vector style, diagram infographic, clean strokes.

---

### How to Write Image Prompts

1. **Lead with the style** — Put the site style first so the AI locks in consistency.
2. **Describe the subject** — What the image shows (e.g. checkmark, graph, flowchart).
3. **Specify constraints** — Black and white, single color, no text (or minimal text if needed).
4. **Add dimensions** — Approximate aspect ratio or size (e.g. wide banner, square).

**Template:**
```
[Style]: Minimal line art, monochrome, single color, geometric, flat, no gradients, no shadows, vector style, diagram infographic, clean strokes.

[Subject]: [What the image shows.]

[Constraints]: Black and white only. [No text / minimal text only.] [Aspect ratio if relevant.]
```

---

### Prompts for Current Images

| Image | Location | Purpose |
|-------|----------|---------|
| **hero.svg** | `confidence-vs-defect-counting` | Hero banner |
| **confidence-diagram.svg** | `confidence-vs-defect-counting` | Inline infographic |

**hero.svg (copy-paste):**
```
Minimal line art, monochrome, single color, geometric, flat, no gradients, no shadows, vector style. A checkmark inside a circle on the left, with space for short text on the right. Clean strokes, diagram aesthetic. Black and white only. Wide banner format, approximately 5:1 aspect ratio. SVG-friendly.
```

**confidence-diagram.svg (copy-paste):**
```
Minimal line art, monochrome, single color, geometric, flat, no gradients, no shadows, vector style. Simple coordinate axes: horizontal axis labeled "Time", vertical axis labeled "Confidence". Clean lines, diagram infographic. Black and white only. Landscape format, approximately 2:1 aspect ratio. SVG-friendly.
```

---

### When Adding New Images

1. Copy the **Style** block from the template above into every prompt.
2. Replace the **Subject** with the new image’s content.
3. Keep **Constraints** (B&W or single color, no gradients, no shadows).
4. Add the prompt to this table in the guide so future images stay consistent.
5. Export as SVG when possible; optimize for small file size.

---

## 6. Closing Philosophy

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
- [ ] Images (if any): minimal, B&W or single color, consistent with Image Prompt Guide
