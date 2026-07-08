const BATCH_SIZE = 25

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const d = new Date(timestamp * 1000)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`
}

// Shared renderer for the two downloadable reports (unfollowers, pending
// requests): an Instagram-style checklist with batches of 25, live
// counters, and checked state persisted to localStorage. Produces a single
// self-contained HTML file (inline CSS/JS, no external dependencies) so it
// can be double-clicked and opened directly in a browser.
export function generateChecklistHtml({
  people,
  heading,
  subheading,
  emptyIcon = '🎉',
  emptyMessage,
  showNames = true,
  showDates = true,
  storageKey,
}) {
  const batchCount = Math.ceil(people.length / BATCH_SIZE)

  const rows = people
    .map((person, i) => {
      const batch = Math.floor(i / BATCH_SIZE) + 1
      const letter = escapeHtml((person.username[0] || '?').toUpperCase())
      const usernameHtml = `<span class="row__username${showNames ? '' : ' row__username--primary'}">@${escapeHtml(person.username)}</span>`
      const nameHtml =
        showNames &&
        (person.name
          ? `<span class="row__name">${escapeHtml(person.name)}</span>`
          : `<span class="row__name row__name--empty">(no name)</span>`)
      const dateHtml = showDates ? `<span class="row__date">${escapeHtml(formatDate(person.timestamp))}</span>` : ''
      return `
        <li class="row" data-key="${escapeHtml(person.key)}" data-batch="${batch}">
          <input type="checkbox" class="row__checkbox" data-key="${escapeHtml(person.key)}" />
          <a class="row__avatar" href="${escapeHtml(person.href)}" target="_blank" rel="noopener noreferrer">${letter}</a>
          <a class="row__info" href="${escapeHtml(person.href)}" target="_blank" rel="noopener noreferrer">
            ${nameHtml || ''}
            ${usernameHtml}
          </a>
          ${dateHtml}
        </li>`
    })
    .join('')

  const batchButtons = Array.from({ length: batchCount }, (_, i) => i + 1)
    .map((n) => `<button class="batch-btn" data-batch="${n}">Batch ${n}</button>`)
    .join('')

  const body = people.length
    ? `<ul class="list">${rows}</ul>`
    : `<div class="empty-state"><div class="empty-state__icon">${emptyIcon}</div><p>${escapeHtml(emptyMessage)}</p></div>`

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(heading)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<style>
  :root {
    --bg: #f0f2f5;
    --card: #ffffff;
    --border: #e5e7eb;
    --text: #262626;
    --text-muted: #8e8e8e;
    --accent-gradient: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    --green: #4caf50;
    --green-tint: #eafbea;
    color-scheme: light;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif;
    padding: 32px 16px 64px;
  }
  .page { max-width: 640px; margin: 0 auto; }
  h1 { font-size: 1.4rem; margin: 0 0 4px; font-weight: 700; }
  .meta { color: var(--text-muted); font-size: 0.85rem; margin: 0 0 20px; }

  .stats {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .stat {
    flex: 1;
    min-width: 100px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px 14px;
    text-align: center;
  }
  .stat__value { font-size: 1.25rem; font-weight: 700; line-height: 1.2; }
  .stat__label { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }

  .batches {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }
  .batch-btn {
    background: var(--card);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 0.8rem;
    cursor: pointer;
  }
  .batch-btn:hover { background: #f5f5f5; }
  .batch-btn--active { border-color: #bc1888; color: #bc1888; font-weight: 600; }
  .batch-btn--done { background: var(--green-tint); border-color: var(--green); color: #2e7d32; }

  .toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }
  .reset-btn {
    background: var(--card);
    border: 1px solid var(--border);
    color: #d32f2f;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 0.8rem;
    cursor: pointer;
  }
  .reset-btn:hover { background: #fff5f5; }

  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s ease;
  }
  .row:last-child { border-bottom: none; }
  .row--checked { background: var(--green-tint); }
  .row--checked .row__name,
  .row--checked .row__username { text-decoration: line-through; color: var(--text-muted); }

  .row__checkbox { flex-shrink: 0; width: 18px; height: 18px; cursor: pointer; accent-color: var(--green); }
  .row__avatar {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--accent-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #fff;
    font-size: 1.05rem;
    text-decoration: none;
  }
  .row__info { flex: 1; min-width: 0; display: flex; flex-direction: column; text-decoration: none; color: inherit; }
  .row__name { font-weight: 600; font-size: 0.92rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .row__name--empty { font-style: italic; color: var(--text-muted); font-weight: 400; }
  .row__username { font-size: 0.82rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .row__username--primary { font-size: 0.92rem; font-weight: 600; color: var(--text); }
  .row__date { flex-shrink: 0; font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; }

  .empty-state { text-align: center; padding: 48px 16px; color: var(--text-muted); }
  .empty-state__icon { font-size: 2.4rem; margin-bottom: 8px; }

  @media (max-width: 480px) {
    .row__date { display: none; }
  }
</style>
</head>
<body>
  <div class="page">
    <h1>${escapeHtml(heading)}</h1>
    <p class="meta">${escapeHtml(subheading)}</p>

    <div class="stats">
      <div class="stat"><div class="stat__value" id="total-count">0</div><div class="stat__label">Total</div></div>
      <div class="stat"><div class="stat__value" id="remaining-count">0</div><div class="stat__label">Remaining</div></div>
      <div class="stat"><div class="stat__value" id="checked-count">0</div><div class="stat__label">Checked off</div></div>
    </div>

    <div class="batches">
      <button class="batch-btn batch-btn--active" data-batch="all">Show all</button>
      ${batchButtons}
    </div>

    <div class="toolbar">
      <button class="reset-btn" id="reset-btn">Reset all checkmarks</button>
    </div>

    ${body}
  </div>

  <script>
    (function () {
      var STORAGE_KEY = ${JSON.stringify(storageKey)};

      function loadState() {
        try {
          return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch (e) {
          return {};
        }
      }
      function saveState(state) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }

      var rows = Array.prototype.slice.call(document.querySelectorAll('.row'));
      var checkboxes = Array.prototype.slice.call(document.querySelectorAll('.row__checkbox'));
      var batchButtons = Array.prototype.slice.call(document.querySelectorAll('.batch-btn'));

      function updateCounts() {
        var total = checkboxes.length;
        var checked = checkboxes.filter(function (c) { return c.checked; }).length;
        document.getElementById('total-count').textContent = total;
        document.getElementById('remaining-count').textContent = total - checked;
        document.getElementById('checked-count').textContent = checked;
      }

      function updateBatchButtons() {
        batchButtons.forEach(function (btn) {
          var batch = btn.getAttribute('data-batch');
          if (batch === 'all') return;
          var batchRows = rows.filter(function (r) { return r.getAttribute('data-batch') === batch; });
          var allChecked = batchRows.length > 0 && batchRows.every(function (r) {
            return r.querySelector('.row__checkbox').checked;
          });
          btn.classList.toggle('batch-btn--done', allChecked);
        });
      }

      function applyState(state) {
        checkboxes.forEach(function (chk) {
          var checked = !!state[chk.getAttribute('data-key')];
          chk.checked = checked;
          chk.closest('.row').classList.toggle('row--checked', checked);
        });
      }

      checkboxes.forEach(function (chk) {
        chk.addEventListener('change', function () {
          var row = chk.closest('.row');
          row.classList.toggle('row--checked', chk.checked);
          var state = loadState();
          if (chk.checked) {
            state[chk.getAttribute('data-key')] = true;
          } else {
            delete state[chk.getAttribute('data-key')];
          }
          saveState(state);
          updateCounts();
          updateBatchButtons();
        });
      });

      batchButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          batchButtons.forEach(function (b) { b.classList.remove('batch-btn--active'); });
          btn.classList.add('batch-btn--active');
          var target = btn.getAttribute('data-batch');
          rows.forEach(function (row) {
            row.style.display = (target === 'all' || row.getAttribute('data-batch') === target) ? '' : 'none';
          });
        });
      });

      document.getElementById('reset-btn').addEventListener('click', function () {
        if (!confirm('Reset all checkmarks? This cannot be undone.')) return;
        localStorage.removeItem(STORAGE_KEY);
        applyState({});
        updateCounts();
        updateBatchButtons();
      });

      applyState(loadState());
      updateCounts();
      updateBatchButtons();
    })();
  </script>
</body>
</html>
`
}
