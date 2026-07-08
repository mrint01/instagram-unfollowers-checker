import { useState } from 'react'
import UnfollowersFlow from './components/UnfollowersFlow.jsx'
import PendingFlow from './components/PendingFlow.jsx'

export default function App() {
  const [mode, setMode] = useState(null)

  return (
    <div className="page">
      {mode === null && (
        <>
          <header className="header">
            <h1>Instagram toolkit</h1>
            <p>
              Two things you can check from your Instagram data export. Everything runs locally
              in your browser — nothing is uploaded anywhere.
            </p>
          </header>

          <section className="mode-select">
            <button className="mode-card" onClick={() => setMode('unfollowers')}>
              <div className="mode-card__icon">🔁</div>
              <div className="mode-card__title">Who doesn't follow you back?</div>
              <div className="mode-card__desc">
                Compare your followers and following lists to find accounts you follow that don't
                follow you back.
              </div>
            </button>
            <button className="mode-card" onClick={() => setMode('pending')}>
              <div className="mode-card__icon">⏳</div>
              <div className="mode-card__title">Pending follow requests</div>
              <div className="mode-card__desc">
                Turn pending_follow_requests.json into a checklist for cancelling requests you
                sent that never got accepted.
              </div>
            </button>
          </section>
        </>
      )}

      {mode === 'unfollowers' && <UnfollowersFlow onBack={() => setMode(null)} />}
      {mode === 'pending' && <PendingFlow onBack={() => setMode(null)} />}

      <footer className="footer">
        <p>Made for personal use · your data never leaves this browser tab.</p>
      </footer>
    </div>
  )
}
