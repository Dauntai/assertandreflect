/**
 * Assert and Reflect - Static client-side search
 * Uses Fuse.js (lazy loaded) for fuzzy search. Matches title, description, tags.
 */
(function () {
  const MAX_RESULTS = 8;
  let searchIndex = null;
  let Fuse = null;
  let fuseInstance = null;

  function getBasePath() {
    const path = (window.location.pathname || '/').replace(/\/$/, '');
    const parts = path ? path.split('/').filter(Boolean) : [];
    const depth = parts.length > 0 && parts[parts.length - 1].includes('.')
      ? parts.length - 1
      : parts.length;
    return depth === 0 ? '' : '../'.repeat(depth);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function loadSearchIndex() {
    if (searchIndex) return Promise.resolve(searchIndex);
    const base = getBasePath();
    return fetch(base + 'search-index.json')
      .then(function (r) {
        if (!r.ok) throw new Error('Search index not found');
        return r.json();
      })
      .then(function (data) {
        searchIndex = data;
        return searchIndex;
      });
  }

  function initFuse() {
    if (fuseInstance && searchIndex) return fuseInstance;
    if (!Fuse || !searchIndex) return null;
    fuseInstance = new Fuse(searchIndex, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.35 },
        { name: 'tags', weight: 0.25 },
      ],
      threshold: 0.4,
      includeScore: true,
    });
    return fuseInstance;
  }

  function search(query) {
    const q = (query || '').trim();
    if (!q || !searchIndex) return [];
    if (!fuseInstance) initFuse();
    if (!fuseInstance) return [];
    const results = fuseInstance.search(q);
    return results.slice(0, MAX_RESULTS).map(function (r) {
      return r.item;
    });
  }

  function escapeHtml(s) {
    if (!s) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function getPostUrl(item) {
    const base = getBasePath();
    const url = (item.url || '').replace(/^\//, '');
    return base + url;
  }

  function highlightMatch(text, query) {
    if (!query || !text) return escapeHtml(text);
    const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('(' + q + ')', 'gi');
    return escapeHtml(text).replace(re, '<mark>$1</mark>');
  }

  function renderResults(items, query) {
    if (!items || items.length === 0) {
      return '<p class="search-results-empty">No matches found.</p>';
    }
    return (
      '<ul class="search-results-list" role="listbox">' +
      items
        .map(function (item) {
          const href = getPostUrl(item);
          const title = highlightMatch(item.title, query);
          const desc = item.description
            ? '<span class="search-result-desc">' + highlightMatch(item.description, query) + '</span>'
            : '';
          const tags =
            item.tags && item.tags.length
              ? '<span class="search-result-tags">' +
                escapeHtml(item.tags.slice(0, 3).join(', ')) +
                '</span>'
              : '';
          return (
            '<li role="option" tabindex="-1"><a href="' +
            escapeHtml(href) +
            '">' +
            '<span class="search-result-title">' +
            title +
            '</span>' +
            desc +
            tags +
            '</a></li>'
          );
        })
        .join('') +
      '</ul>'
    );
  }

  function initSearch() {
    const container = document.getElementById('search-container');
    if (!container) return;

    const base = getBasePath();
    const fuseScript =
      'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js';

    const html =
      '<div class="search-wrap">' +
      '<button type="button" class="search-trigger" id="search-trigger" aria-label="Open search" aria-expanded="false" aria-controls="search-dropdown">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' +
      '</button>' +
      '<div class="search-expand" id="search-expand">' +
      '<label for="search-input" class="visually-hidden">Search posts</label>' +
      '<input type="search" id="search-input" class="search-input" placeholder="Search..." autocomplete="off" aria-autocomplete="list" aria-controls="search-dropdown" aria-expanded="false">' +
      '<div class="search-dropdown" id="search-dropdown" role="listbox" aria-label="Search results" hidden></div>' +
      '</div>' +
      '</div>';
    container.innerHTML = html;

    const wrap = container.querySelector('.search-wrap');
    const trigger = document.getElementById('search-trigger');
    const expand = document.getElementById('search-expand');
    const input = document.getElementById('search-input');
    const dropdown = document.getElementById('search-dropdown');
    let selectedIndex = -1;
    let resultsCache = [];

    function showDropdown() {
      dropdown.hidden = false;
      dropdown.setAttribute('aria-expanded', 'true');
      expand.classList.add('search-expanded');
      input.focus();
    }

    function hideDropdown() {
      dropdown.hidden = true;
      dropdown.setAttribute('aria-expanded', 'false');
      expand.classList.remove('search-expanded');
      selectedIndex = -1;
    }

    function closeSearch() {
      hideDropdown();
      wrap.classList.remove('search-open');
      trigger.setAttribute('aria-expanded', 'false');
      input.value = '';
    }

    function performSearch() {
      const q = input.value.trim();
      if (!q) {
        dropdown.innerHTML = '<p class="search-results-hint">Type to search</p>';
        dropdown.hidden = false;
        return;
      }
      if (!searchIndex || !Fuse) {
        dropdown.innerHTML = '<p class="search-results-loading">Loading...</p>';
        dropdown.hidden = false;
        return;
      }
      const results = search(q);
      resultsCache = results;
      dropdown.innerHTML = renderResults(results, q);
      dropdown.hidden = false;
      selectedIndex = -1;
    }

    function selectResult(index) {
      const items = dropdown.querySelectorAll('li[role="option"]');
      items.forEach(function (el, i) {
        el.classList.toggle('search-result-selected', i === index);
      });
      selectedIndex = index;
    }

    function openResult(index) {
      const items = dropdown.querySelectorAll('li[role="option"] a');
      const link = items[index];
      if (link) link.click();
    }

    trigger.addEventListener('click', function () {
      if (wrap.classList.contains('search-open')) {
        closeSearch();
      } else {
        wrap.classList.add('search-open');
        trigger.setAttribute('aria-expanded', 'true');
        showDropdown();
        if (!searchIndex && !Fuse) {
          Promise.all([loadScript(fuseScript), loadSearchIndex()])
            .then(function (arr) {
              Fuse = window.Fuse;
              if (Fuse) initFuse();
              performSearch();
            })
            .catch(function () {
              dropdown.innerHTML =
                '<p class="search-results-empty">Search unavailable.</p>';
            });
        } else {
          performSearch();
        }
      }
    });

    input.addEventListener('input', function () {
      performSearch();
    });

    input.addEventListener('focus', function () {
      if (input.value.trim()) showDropdown();
    });

    input.addEventListener('keydown', function (e) {
      const items = dropdown.querySelectorAll('li[role="option"]');
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSearch();
        trigger.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items.length) {
          selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
          selectResult(selectedIndex);
          items[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length) {
          selectedIndex = Math.max(selectedIndex - 1, -1);
          selectResult(selectedIndex);
          if (selectedIndex >= 0) {
            items[selectedIndex].scrollIntoView({ block: 'nearest' });
          }
        }
      } else if (e.key === 'Enter' && selectedIndex >= 0 && items[selectedIndex]) {
        e.preventDefault();
        openResult(selectedIndex);
      }
    });

    dropdown.addEventListener('click', function (e) {
      const a = e.target.closest('a');
      if (a) {
        closeSearch();
      }
    });

    document.addEventListener('click', function (e) {
      if (
        container.contains(e.target) === false &&
        wrap.classList.contains('search-open')
      ) {
        closeSearch();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && wrap.classList.contains('search-open')) {
        closeSearch();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
