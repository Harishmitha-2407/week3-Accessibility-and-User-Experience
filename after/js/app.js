/* Week 3 - Accessibility-focused behaviour. Each feature notes the WCAG criterion it supports. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  var $ = function (s) { return document.querySelector(s); };

  // ---- Responsive menu: aria-expanded + Escape to close (2.1.1 Keyboard) ----
  var menuBtn = $('#menu-btn'), nav = $('#site-nav');
  function setMenu(open) { menuBtn.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
  });

  // ---- Theme toggle: respects system preference, remembers choice, exposes state (1.4.3, 4.1.2) ----
  var themeBtn = $('#theme-btn');
  function applyTheme(dark) {
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeBtn.setAttribute('aria-pressed', String(dark));
  }
  var saved = null; try { saved = localStorage.getItem('theme'); } catch (e) { /* storage may be blocked */ }
  applyTheme(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
  themeBtn.addEventListener('click', function () {
    var dark = themeBtn.getAttribute('aria-pressed') !== 'true';
    applyTheme(dark);
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  });

  // ---- Search: filters posts and announces the result count politely (4.1.3 Status Messages) ----
  var posts = function () { return Array.prototype.slice.call(document.querySelectorAll('#post-list .post')); };
  $('#search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var q = $('#q').value.trim().toLowerCase(), n = 0;
    posts().forEach(function (p) { var hit = !q || p.dataset.title.indexOf(q) > -1; p.hidden = !hit; if (hit) n++; });
    $('#search-status').textContent = n + (n === 1 ? ' article found.' : ' articles found.');
  });

  // ---- Load more: adds content, moves nothing, announces count, keeps focus on button ----
  var extra = [['Keyboard shortcuts without traps', '2026-08-14', '14 August 2026'], ['Writing useful alt text', '2026-08-02', '2 August 2026']];
  $('#more-btn').addEventListener('click', function () {
    var list = $('#post-list'), btn = this;
    extra.forEach(function (x, i) {
      var li = document.createElement('li'); li.className = 'post'; li.dataset.title = x[0].toLowerCase();
      var id = 'x' + i + Date.now();
      li.innerHTML = '<article aria-labelledby="' + id + '"><h3 id="' + id + '"><a href="#">' + x[0] +
        '</a></h3><p><time datetime="' + x[1] + '">' + x[2] + '</time></p></article>';
      list.appendChild(li);
    });
    $('#more-status').textContent = extra.length + ' more posts loaded.';
    btn.disabled = true; btn.setAttribute('aria-disabled', 'true');
    btn.textContent = 'All posts loaded';
  });

  // ---- Newsletter form: inline errors + error summary that receives focus (3.3.1, 3.3.3) ----
  var form = $('#news-form'), summary = $('#error-summary');
  function fieldError(input, msg) {
    var out = $('#' + input.id + '-err');
    out.hidden = !msg; out.textContent = msg || '';
    input.setAttribute('aria-invalid', String(!!msg));
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name, email = form.elements.email, errors = [];
    fieldError(name, ''); fieldError(email, ''); $('#news-ok').textContent = '';
    if (!name.value.trim()) { fieldError(name, 'Enter your name.'); errors.push([name, 'Enter your name.']); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      var m = 'Enter an email address like name@example.com.';
      fieldError(email, m); errors.push([email, m]);
    }
    if (errors.length) {
      summary.hidden = false;
      summary.innerHTML = '<p><strong>There ' + (errors.length > 1 ? 'are ' + errors.length + ' problems' : 'is 1 problem') + ' with your form:</strong></p><ul></ul>';
      errors.forEach(function (er) {
        var li = document.createElement('li'), a = document.createElement('a');
        a.href = '#' + er[0].id; a.textContent = er[1];
        a.addEventListener('click', function (ev) { ev.preventDefault(); er[0].focus(); }); // links move focus to the field
        li.appendChild(a); summary.querySelector('ul').appendChild(li);
      });
      summary.focus();
    } else {
      summary.hidden = true; form.reset();
      $('#news-ok').textContent = 'Thank you, you are subscribed.';
    }
  });
})();
