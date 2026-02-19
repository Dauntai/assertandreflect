# Post Images

Store images for each post in a subfolder named by the post slug:

```
assets/images/posts/<post-slug>/
  hero.svg          # Optional hero image (set heroImage in frontmatter)
  diagram.svg       # Inline images referenced in Markdown
  screenshot.png
```

Reference in Markdown: `![Alt text](/assets/images/posts/<slug>/<filename>)`

See `editorial-style.md` for full documentation.
