/**
 * Assert and Reflect - Main JavaScript
 * Dark mode toggle + dynamic post loading
 */

(function () {
  const THEME_KEY = 'assert-reflect-theme';

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateToggleLabel();
  }

  function updateToggleLabel() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark';
  }

  function initThemeToggle() {
    setTheme(getTheme());
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
      });
    }
  }

  function loadPosts(options) {
    const { containerId, limit, category } = options || {};
    const container = containerId ? document.getElementById(containerId) : null;
    if (!container) return;

    const base = getBasePath();
    fetch(base + 'posts.json')
      .then((r) => r.json())
      .then((posts) => {
        let filtered = posts;
        if (category) {
          filtered = posts.filter((p) => p.category === category);
        }
        const slice = limit ? filtered.slice(0, limit) : filtered;
        container.innerHTML = renderPostList(slice);
      })
      .catch((err) => {
        container.innerHTML = '<p class="loading">Posts will appear after running the build.</p>';
        console.warn('Could not load posts.json:', err);
      });
  }

  function getBasePath() {
    const path = (window.location.pathname || '/').replace(/\/$/, '');
    const parts = path ? path.split('/').filter(Boolean) : [];
    const depth = parts.length > 0 && parts[parts.length - 1].includes('.')
      ? parts.length - 1
      : parts.length;
    return depth === 0 ? '' : '../'.repeat(depth);
  }

  function renderPostList(posts) {
    if (!posts || posts.length === 0) {
      return '<p class="loading">No posts yet.</p>';
    }
    return '<ul class="posts-list">' + posts.map(function (p) {
      const excerpt = p.excerpt ? '<span class="excerpt">' + escapeHtml(p.excerpt) + '</span>' : '';
      const meta = '<span class="meta">' + escapeHtml(p.date + ' · ' + p.category) + '</span>';
      return '<li><a href="' + getPostUrl(p) + '">' + escapeHtml(p.title) + '</a>' + excerpt + meta + '</li>';
    }).join('') + '</ul>';
  }

  function getPostUrl(post) {
    const base = getBasePath();
    const url = post.url.replace(/^\//, '');
    return base + url;
  }

  function escapeHtml(s) {
    if (!s) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  initThemeToggle();

  if (typeof window.assertReflect !== 'undefined') {
    const opts = window.assertReflect;
    loadPosts(opts);
  }
})();
