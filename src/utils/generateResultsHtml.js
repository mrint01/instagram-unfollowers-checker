function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function generateResultsHtml(people) {
  const generatedAt = new Date().toLocaleString()

  const rows = people
    .map(
      (person) => `
        <li>
          <a class="person-card" href="${escapeHtml(person.href)}" target="_blank" rel="noopener noreferrer">
            <span class="person-card__avatar">${escapeHtml(person.username[0]?.toUpperCase() ?? '?')}</span>
            <span class="person-card__name">@${escapeHtml(person.username)}</span>
            <span class="person-card__arrow">&#8599;</span>
          </a>
        </li>`
    )
    .join('')

  const body = people.length
    ? `<ul class="results-grid">${rows}</ul>`
    : `<div class="empty-state"><div class="empty-state__icon">🎉</div><p>Everyone you follow also follows you back.</p></div>`

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Instagram unfollowers report</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root {
    --bg: #0f0b16;
    --surface: rgba(255, 255, 255, 0.06);
    --surface-border: rgba(255, 255, 255, 0.12);
    --text: #f5f3f7;
    --text-muted: #b8aec2;
    --accent-gradient: linear-gradient(135deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%);
    color-scheme: dark;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    padding: 48px 20px 80px;
  }
  .page { max-width: 760px; margin: 0 auto; }
  h1 {
    font-size: clamp(1.6rem, 4vw, 2.2rem);
    margin: 0 0 8px;
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 800;
  }
  .meta { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 28px; }
  .results-grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
  }
  .person-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--surface);
    border: 1px solid var(--surface-border);
    border-radius: 14px;
    padding: 12px 14px;
    text-decoration: none;
    color: var(--text);
  }
  .person-card:hover { border-color: rgba(214, 41, 118, 0.5); }
  .person-card__avatar {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--accent-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #1a1120;
    font-size: 0.95rem;
  }
  .person-card__name { flex: 1; font-size: 0.9rem; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .person-card__arrow { color: var(--text-muted); font-size: 0.9rem; }
  .empty-state { text-align: center; padding: 48px 16px; color: var(--text-muted); }
  .empty-state__icon { font-size: 2.4rem; margin-bottom: 8px; }
</style>
</head>
<body>
  <div class="page">
    <h1>${people.length} account${people.length === 1 ? '' : 's'} that don't follow you back</h1>
    <p class="meta">Generated on ${escapeHtml(generatedAt)}</p>
    ${body}
  </div>
</body>
</html>
`
}
