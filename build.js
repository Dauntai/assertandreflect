const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const config = require('./site.config.js');
const OUT_DIR = process.env.OUT_DIR ? path.resolve(__dirname, process.env.OUT_DIR) : __dirname;
const CONTENT_DIR = path.join(__dirname, 'content');
const POSTS_JSON_PATH = path.join(OUT_DIR, 'posts.json');
const SITE_URL = config.siteUrl.replace(/\/$/, '');

const CATEGORIES = ['guides', 'strategy', 'reflections'];
const CATEGORY_LABELS = { guides: 'Guides', strategy: 'Strategy', reflections: 'Reflections' };
const AUTHOR = config.author;
const WPM = 200; // words per minute for reading time

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function tagSlugToName(slug) {
  return String(slug)
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function getSlug(filePath, frontmatter) {
  if (frontmatter.slug) return slugify(String(frontmatter.slug));
  const base = path.basename(filePath, '.md');
  if (/^[a-z0-9-]+$/.test(base)) return base;
  return slugify(base);
}

function estimateReadingTime(text) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WPM));
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getRelatedPosts(currentSlug, currentCategory, allPosts, limit = 3) {
  const others = allPosts.filter((p) => p.slug !== currentSlug);
  const sameCategory = others.filter((p) => p.category === currentCategory);
  const otherCategory = others.filter((p) => p.category !== currentCategory);
  const related = [...sameCategory, ...otherCategory].slice(0, limit);
  return related;
}

function configureMarkedForImages() {
  const renderer = new marked.Renderer();
  const defaultImage = renderer.image.bind(renderer);
  renderer.image = function (href, title, text) {
    const alt = text && text.trim() ? text : path.basename(href, path.extname(href)).replace(/[-_]/g, ' ');
    return defaultImage(href, title, alt);
  };
  marked.setOptions({ renderer });
}

function wrapPostHtml(title, content, meta, relatedPosts, tags = []) {
  const escapedTitle = escapeHtml(title);
  const escapedDesc = escapeHtml(meta.excerpt || '');
  const postUrl = `${SITE_URL}${meta.url}`;
  const publishedDate = meta.date || '';
  const categoryLabel = CATEGORY_LABELS[meta.category] || meta.category;
  const readingTime = meta.readingTime || 1;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: categoryLabel, item: SITE_URL + '/' + meta.category + '/' },
      { '@type': 'ListItem', position: 3, name: title, item: postUrl },
    ],
  };

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: meta.excerpt || '',
    datePublished: publishedDate ? `${publishedDate}T00:00:00+00:00` : undefined,
    dateModified: publishedDate ? `${publishedDate}T00:00:00+00:00` : undefined,
    wordCount: (content || '').replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(Boolean).length,
    author: {
      '@type': 'Person',
      name: AUTHOR.name,
      jobTitle: AUTHOR.jobTitle,
      description: AUTHOR.description,
      url: SITE_URL + '/about.html',
      sameAs: AUTHOR.sameAs,
    },
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
  };

  const relatedHtml =
    relatedPosts && relatedPosts.length > 0
      ? `
    <aside class="related-posts" aria-labelledby="related-heading">
      <h2 id="related-heading">Related Posts</h2>
      <ul>
        ${relatedPosts
          .map(
            (p) =>
              `<li><a href="${escapeHtml(p.url)}">${escapeHtml(p.title)}</a> <span class="related-meta">${escapeHtml(p.category)}</span></li>`
          )
          .join('')}
      </ul>
    </aside>`
      : '';

  const breadcrumbHtml = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/${meta.category}/">${escapeHtml(categoryLabel)}</a></li>
        <li aria-current="page">${escapedTitle}</li>
      </ol>
    </nav>`;

  const tagsHtml =
    tags && tags.length > 0
      ? `<p class="post-tags" aria-label="Tags">${tags
          .map(
            (t) =>
              `<a href="/tags/${escapeHtml(t.slug)}.html" class="post-tag">${escapeHtml(t.name)}</a>`
          )
          .join(' ')}</p>`
      : '';

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTitle} | Assert and Reflect</title>
  <meta name="description" content="${escapedDesc}">
  <link rel="canonical" href="${postUrl}">
  <meta property="og:title" content="${escapedTitle} | Assert and Reflect">
  <meta property="og:description" content="${escapedDesc}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${postUrl}">
  <meta property="og:site_name" content="Assert and Reflect">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapedTitle} | Assert and Reflect">
  <meta name="twitter:description" content="${escapedDesc}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="/assets/css/main.css" as="style">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Source+Sans+3:wght@400;500;600&family=Source+Serif+4:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Assert and Reflect">
  <script type="application/ld+json">${JSON.stringify(blogPostingSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <header class="site-header">
    <nav class="nav" aria-label="Main navigation">
      <a href="/">Home</a>
      <a href="/about.html">About</a>
      <a href="/guides/">Guides</a>
      <a href="/strategy/">Strategy</a>
      <a href="/reflections/">Reflections</a>
      <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">Dark</button>
    </nav>
  </header>
  <main class="main post-main">
    ${breadcrumbHtml}
    <article class="post">
      <header class="post-header">
        <span class="post-category-tag" aria-label="Category">${escapeHtml(categoryLabel)}</span>
        <h1>${escapedTitle}</h1>
        ${tagsHtml}
        <p class="post-meta">
          ${publishedDate || ''}
          <span aria-hidden="true"> · </span>
          <span class="reading-time">${readingTime} min read</span>
          <span aria-hidden="true"> · </span>
          ${escapeHtml(categoryLabel)}
        </p>
      </header>
      <div class="post-content">
        ${content}
      </div>
      <p class="post-byline">Written by <a href="/about.html">${escapeHtml(AUTHOR.name)}</a></p>
      ${relatedHtml}
    </article>
  </main>
  <footer class="site-footer">
    <p>Assert and Reflect &mdash; Testing is about creating confidence. <a href="/feed.xml">RSS</a></p>
  </footer>
  <script src="/assets/js/main.js"></script>
</body>
</html>`;
}

function generateTagPageHtml(tagSlug, tagName, posts) {
  const escapedTagName = escapeHtml(tagName);
  const tagUrl = `${SITE_URL}/tags/${tagSlug}.html`;
  const metaDesc = `Articles about ${escapedTagName} in software testing and quality engineering.`;

  const postsHtml =
    posts.length === 0
      ? '<p>No posts with this tag yet.</p>'
      : `<ul class="posts-list">
${posts
  .map(
    (p) => `        <li>
          <a href="${escapeHtml(p.url)}">${escapeHtml(p.title)}</a>
          <span class="excerpt">${escapeHtml(p.excerpt || '')}</span>
          <span class="meta">${escapeHtml(p.date || '')} · ${escapeHtml(p.category)}</span>
        </li>`
  )
  .join('\n')}
      </ul>`;

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTagName} | Assert and Reflect</title>
  <meta name="description" content="${escapeHtml(metaDesc)}">
  <link rel="canonical" href="${tagUrl}">
  <meta property="og:title" content="${escapedTagName} | Assert and Reflect">
  <meta property="og:description" content="${escapeHtml(metaDesc)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${tagUrl}">
  <meta property="og:site_name" content="Assert and Reflect">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapedTagName} | Assert and Reflect">
  <meta name="twitter:description" content="${escapeHtml(metaDesc)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="/assets/css/main.css" as="style">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Source+Sans+3:wght@400;500;600&family=Source+Serif+4:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Assert and Reflect">
</head>
<body>
  <header class="site-header">
    <nav class="nav" aria-label="Main navigation">
      <a href="/">Home</a>
      <a href="/about.html">About</a>
      <a href="/guides/">Guides</a>
      <a href="/strategy/">Strategy</a>
      <a href="/reflections/">Reflections</a>
      <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">Dark</button>
    </nav>
  </header>
  <main class="main">
    <header>
      <h1 class="page-title">${escapedTagName}</h1>
      <p>Articles about ${escapedTagName} in software testing and quality engineering.</p>
    </header>
    <section class="posts-section" aria-labelledby="tag-posts-heading">
      <h2 id="tag-posts-heading">Posts</h2>
      ${postsHtml}
    </section>
  </main>
  <footer class="site-footer">
    <p>Assert and Reflect &mdash; Testing is about creating confidence. <a href="/feed.xml">RSS</a></p>
  </footer>
  <script src="/assets/js/main.js"></script>
</body>
</html>`;
}

function generateTagPages(tagsMap) {
  const tagsDir = path.join(OUT_DIR, 'tags');
  if (!fs.existsSync(tagsDir)) {
    fs.mkdirSync(tagsDir, { recursive: true });
  }
  for (const [tagSlug, { name, posts }] of tagsMap) {
    const html = generateTagPageHtml(tagSlug, name, posts);
    fs.writeFileSync(path.join(tagsDir, `${tagSlug}.html`), html, 'utf8');
    console.log('Built tag:', `/tags/${tagSlug}.html`);
  }
}

function generateSitemap(allPosts, tagSlugs = []) {
  const staticUrls = [
    { loc: SITE_URL + '/', changefreq: 'weekly', priority: '1.0' },
    { loc: SITE_URL + '/about.html', changefreq: 'monthly', priority: '0.8' },
    { loc: SITE_URL + '/guides/', changefreq: 'weekly', priority: '0.9' },
    { loc: SITE_URL + '/strategy/', changefreq: 'weekly', priority: '0.9' },
    { loc: SITE_URL + '/reflections/', changefreq: 'weekly', priority: '0.9' },
  ];

  const tagUrls = tagSlugs.map((slug) => ({
    loc: SITE_URL + '/tags/' + slug + '.html',
    changefreq: 'weekly',
    priority: '0.7',
  }));

  const postUrls = allPosts.map((p) => ({
    loc: SITE_URL + p.url,
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: p.date ? `${p.date}T00:00:00+00:00` : undefined,
  }));

  const urls = [...staticUrls, ...tagUrls, ...postUrls];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), sitemap, 'utf8');
  console.log('Generated sitemap.xml');
}

function generateRssFeed(allPosts) {
  const items = allPosts
    .slice(0, 50)
    .map(
      (p) => `  <item>
    <title>${escapeHtml(p.title)}</title>
    <link>${SITE_URL}${p.url}</link>
    <guid isPermaLink="true">${SITE_URL}${p.url}</guid>
    <description>${escapeHtml(p.excerpt || '')}</description>
    <pubDate>${p.date ? new Date(p.date + 'T00:00:00Z').toUTCString() : ''}</pubDate>
    <category>${escapeHtml(p.category)}</category>
  </item>`
    )
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Assert and Reflect</title>
    <link>${SITE_URL}/</link>
    <description>Testing is about creating confidence. Practical guides, architecture strategy, and reflections on quality.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(OUT_DIR, 'feed.xml'), rss, 'utf8');
  console.log('Generated feed.xml');
}

function generateRobotsTxt() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(OUT_DIR, 'robots.txt'), robots, 'utf8');
  console.log('Generated robots.txt');
}

function ensureHeadingHierarchy(content) {
  const hasH2 = /^##\s/m.test(content) || /<h2/i.test(content);
  const hasH3 = /^###\s/m.test(content) || /<h3/i.test(content);
  if (!hasH2 && !hasH3) {
    console.warn('  ⚠ Post should have at least one H2 or H3 for SEO');
  }
}

function build() {
  configureMarkedForImages();

  const allPosts = [];
  const postsBySlug = new Map();

  for (const category of CATEGORIES) {
    const categoryPath = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(categoryPath)) continue;

    const outDir = path.join(OUT_DIR, category);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content } = matter(raw);
      const slug = getSlug(filePath, frontmatter);
      const html = marked.parse(content);
      const dateVal = frontmatter.date;
      const dateStr =
        dateVal instanceof Date ? dateVal.toISOString().slice(0, 10) : String(dateVal || '');
      const readingTime = estimateReadingTime(content);
      const rawTags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
      const tags = rawTags.map((t) => {
        const slug = slugify(String(t));
        return { slug, name: slug ? tagSlugToName(slug) : String(t) };
      }).filter((t) => t.slug);

      const meta = {
        title: frontmatter.title || slug,
        date: dateStr,
        category: frontmatter.category || category,
        excerpt: frontmatter.excerpt || '',
        slug,
        url: `/${category}/${slug}.html`,
        readingTime,
        author: frontmatter.author || 'shreenidhi',
        tags,
      };

      const postEntry = {
        title: meta.title,
        slug,
        date: dateStr,
        category: meta.category,
        excerpt: meta.excerpt,
        url: meta.url,
        tags: meta.tags.map((t) => ({ slug: t.slug, name: t.name })),
      };
      allPosts.push(postEntry);
      postsBySlug.set(slug, postEntry);

      ensureHeadingHierarchy(content);

      const related = getRelatedPosts(slug, meta.category, allPosts);
      const fullHtml = wrapPostHtml(meta.title, html, meta, related, meta.tags);
      const outPath = path.join(outDir, `${slug}.html`);
      fs.writeFileSync(outPath, fullHtml, 'utf8');
      console.log('Built:', meta.url);
    }
  }

  allPosts.sort((a, b) => {
    const da = String(a.date || '0000-00-00');
    const db = String(b.date || '0000-00-00');
    return db.localeCompare(da);
  });

  const tagsMap = new Map();
  for (const post of allPosts) {
    for (const t of post.tags || []) {
      if (!tagsMap.has(t.slug)) {
        tagsMap.set(t.slug, { name: t.name, posts: [] });
      }
      tagsMap.get(t.slug).posts.push(post);
    }
  }
  for (const [, data] of tagsMap) {
    data.posts.sort((a, b) => {
      const da = String(a.date || '0000-00-00');
      const db = String(b.date || '0000-00-00');
      return db.localeCompare(da);
    });
  }

  if (tagsMap.size > 0) {
    generateTagPages(tagsMap);
  }

  fs.writeFileSync(POSTS_JSON_PATH, JSON.stringify(allPosts, null, 2), 'utf8');
  console.log('Generated posts.json with', allPosts.length, 'posts');

  generateSitemap(allPosts, [...tagsMap.keys()]);
  generateRssFeed(allPosts);
  generateRobotsTxt();

  const oldPostsDir = path.join(OUT_DIR, 'posts');
  if (fs.existsSync(oldPostsDir)) {
    const oldFiles = fs.readdirSync(oldPostsDir).filter((f) => f.endsWith('.html'));
    for (const f of oldFiles) {
      fs.unlinkSync(path.join(oldPostsDir, f));
    }
    if (fs.readdirSync(oldPostsDir).length === 0) {
      fs.rmdirSync(oldPostsDir);
    }
    console.log('Removed legacy posts/ directory');
  }

  if (OUT_DIR !== __dirname) {
    const staticFiles = ['index.html', 'about.html'];
    for (const f of staticFiles) {
      const src = path.join(__dirname, f);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(OUT_DIR, f));
        console.log('Copied:', f);
      }
    }
    const assetsSrc = path.join(__dirname, 'assets');
    const assetsDest = path.join(OUT_DIR, 'assets');
    if (fs.existsSync(assetsSrc)) {
      copyDirSync(assetsSrc, assetsDest);
      console.log('Copied: assets/');
    }
    for (const cat of CATEGORIES) {
      const catIndex = path.join(__dirname, cat, 'index.html');
      if (fs.existsSync(catIndex)) {
        const catDestDir = path.join(OUT_DIR, cat);
        if (!fs.existsSync(catDestDir)) fs.mkdirSync(catDestDir, { recursive: true });
        fs.copyFileSync(catIndex, path.join(catDestDir, 'index.html'));
        console.log('Copied:', cat + '/index.html');
      }
    }
  }
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

build();
