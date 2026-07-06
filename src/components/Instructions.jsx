import { useState } from 'react'

const STEPS = [
  {
    title: 'Open Instagram settings',
    body: 'On the Instagram app, go to your profile → tap the ☰ menu → Settings and privacy. On the web, click your profile picture → Settings.',
  },
  {
    title: 'Find "Download your information"',
    body: 'Go to Accounts Center → Your information and permissions → Download your information. (On older app versions: Settings → Accounts Center → Your information and permissions.)',
  },
  {
    title: 'Start a request for your account',
    body: 'Choose "Request a download" → select your Instagram profile → "Select types of information".',
  },
  {
    title: 'Select only "Followers and following"',
    body: 'Deselect everything else to keep the export small and fast to process.',
  },
  {
    title: 'Choose format: JSON',
    body: 'Set "Format" to JSON (not HTML) and "Date range" to "All time", then submit the request.',
  },
  {
    title: 'Wait for the email, then download',
    body: 'Instagram emails you (usually within minutes to a few hours) with a link to download a .zip file.',
  },
  {
    title: 'Unzip and find the two files',
    body: 'Inside the zip, look under connections/followers_and_following/ for followers_1.json and following.json. Upload those two files above.',
  },
]

export default function Instructions() {
  const [open, setOpen] = useState(false)

  return (
    <section className="instructions">
      <button className="instructions__toggle" onClick={() => setOpen((o) => !o)}>
        <span>📖 How do I get my followers/following JSON files from Instagram?</span>
        <span className={`instructions__chevron ${open ? 'instructions__chevron--open' : ''}`}>⌄</span>
      </button>
      {open && (
        <ol className="instructions__list">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <span className="instructions__step-number">{i + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
