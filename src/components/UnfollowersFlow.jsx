import { useEffect, useMemo, useRef, useState } from 'react'
import FileUploader from './FileUploader.jsx'
import Instructions from './Instructions.jsx'
import { parseInstagramFile, findNotFollowingBack } from '../utils/parseInstagramData.js'
import { generateResultsHtml } from '../utils/generateResultsHtml.js'

export default function UnfollowersFlow({ onBack }) {
  const [followers, setFollowers] = useState(null)
  const [following, setFollowing] = useState(null)
  const [followersFile, setFollowersFile] = useState(null)
  const [followingFile, setFollowingFile] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const downloadUrlRef = useRef(null)

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

  const isProcessing = notFollowingBack !== null && !downloadUrl

  useEffect(() => {
    if (!notFollowingBack) return
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 20 + 10, 100))
    }, 150)
    const timeout = setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      const html = generateResultsHtml(notFollowingBack)
      const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
      downloadUrlRef.current = url
      setDownloadUrl(url)
    }, 900)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [notFollowingBack])

  useEffect(() => {
    return () => {
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
    }
  }, [])

  const reset = () => {
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
    downloadUrlRef.current = null
    setFollowers(null)
    setFollowing(null)
    setFollowersFile(null)
    setFollowingFile(null)
    setError(null)
    setProgress(0)
    setDownloadUrl(null)
  }

  return (
    <div>
      <button className="back-button" onClick={onBack}>
        &larr; Back
      </button>

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

      {isProcessing && (
        <section className="progress">
          <div className="progress__label">Comparing your lists…</div>
          <div className="progress__track">
            <div className="progress__fill" style={{ width: `${progress}%` }} />
          </div>
        </section>
      )}

      {downloadUrl && (
        <section className="results">
          <p className="results__count">
            <strong>{notFollowingBack.length}</strong> account
            {notFollowingBack.length === 1 ? '' : 's'} you follow that{' '}
            {notFollowingBack.length === 1 ? "doesn't" : "don't"} follow you back
          </p>
          <div className="results__actions">
            <a className="download-button" href={downloadUrl} download="instagram-unfollowers.html">
              ⬇️ Download HTML report
            </a>
            <button className="reset-button" onClick={reset}>
              Start over
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
