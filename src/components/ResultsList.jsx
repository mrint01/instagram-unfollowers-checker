export default function ResultsList({ people }) {
  if (people.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">🎉</div>
        <p>Everyone you follow also follows you back.</p>
      </div>
    )
  }

  return (
    <ul className="results-grid">
      {people.map((person) => (
        <li key={person.username}>
          <a
            className="person-card"
            href={person.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open @${person.username} on Instagram`}
          >
            <span className="person-card__avatar">{person.username[0]?.toUpperCase()}</span>
            <span className="person-card__name">@{person.username}</span>
            <span className="person-card__arrow">↗</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
