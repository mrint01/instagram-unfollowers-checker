import { useMemo, useState } from 'react'
import FileUploader from './components/FileUploader.jsx'
import ResultsList from './components/ResultsList.jsx'
import Instructions from './components/Instructions.jsx'
import { parseInstagramFile, findNotFollowingBack } from './utils/parseInstagramData.js'

export default function App() {
  const [followers, setFollowers] = useState(null)
  const [following, setFollowing] = useState(null)
  const [followersFile, setFollowersFile] = useState(null)
  const [followingFile, setFollowingFile] = useState(null)
  const [error, setError] = useState(null)

  const handleFile = async (file, target) => {
    setError(null)
    try {
      const usernames = await parseInstagramFile(file)
      if (target === 'followers') {
        setFollowers(usernames)
        setFollowersFile(file)
      } else {
        setFollowing(usernames)
        setFollowingFile(file)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const notFollowingBack = useMemo(() => {
    if (!followers || !following) return null
    return findNotFollowingBack(followers, following)
  }, [followers, following])

  const reset = () => {
    setFollowers(null)
    setFollowing(null)
    setFollowersFile(null)
    setFollowingFile(null)
    setError(null)
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Who doesn't follow you back?</h1>
        <p>
          Upload your Instagram <strong>followers</strong> and <strong>following</strong> JSON
          files. Everything runs locally in your browser — nothing is uploaded anywhere.
        </p>
      </header>

      <Instructions />

      <section className="uploaders">
        <FileUploader
          label="Followers file"
          hint="followers_1.json"
          file={followersFile}
          count={followers?.size}
          onFile={(f) => handleFile(f, 'followers')}
        />
        <FileUploader
          label="Following file"
          hint="following.json"
          file={followingFile}
          count={following?.size}
          onFile={(f) => handleFile(f, 'following')}
        />
      </section>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {notFollowingBack && (
        <section className="results">
          <div className="results__header">
            <h2>
              {notFollowingBack.length} account{notFollowingBack.length === 1 ? '' : 's'} you
              follow that don't follow you back
            </h2>
            <button className="reset-button" onClick={reset}>
              Start over
            </button>
          </div>
          <ResultsList people={notFollowingBack} />
        </section>
      )}

      <footer className="footer">
        <p>Made for personal use · your data never leaves this browser tab.</p>
      </footer>
    </div>
  )
}
