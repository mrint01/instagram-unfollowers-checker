import { useEffect, useRef, useState } from 'react'
import FileUploader from './FileUploader.jsx'
import Instructions from './Instructions.jsx'
import { parsePendingFile } from '../utils/parsePendingRequests.js'
import { generatePendingHtml } from '../utils/generatePendingHtml.js'

const PENDING_LAST_STEP = {
  title: 'Unzip and find the pending requests file',
  body: 'Inside the zip, look under connections/followers_and_following/ for pending_follow_requests.json. Upload that file above.',
}

export default function PendingFlow({ onBack }) {
  const [people, setPeople] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const downloadUrlRef = useRef(null)

  const handleFile = async (f) => {
    setError(null)
    setDownloadUrl(null)
    try {
      const parsed = await parsePendingFile(f)
      setPeople(parsed)
      setFile(f)
    } catch (err) {
      setError(err.message)
    }
  }

  const isProcessing = people !== null && !downloadUrl

  useEffect(() => {
    if (!people) return
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 20 + 10, 100))
    }, 150)
    const timeout = setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      const html = generatePendingHtml(people)
      const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
      downloadUrlRef.current = url
      setDownloadUrl(url)
    }, 900)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [people])

  useEffect(() => {
    return () => {
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
    }
  }, [])

  const reset = () => {
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
    downloadUrlRef.current = null
    setPeople(null)
    setFile(null)
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
        <h1>Pending follow requests</h1>
        <p>
          Upload your Instagram <strong>pending_follow_requests.json</strong> file to get a
          checklist for cancelling requests that never got accepted. Everything runs locally in
          your browser — nothing is uploaded anywhere.
        </p>
      </header>

      <Instructions
        title="How do I get my pending_follow_requests.json file from Instagram?"
        lastStep={PENDING_LAST_STEP}
      />

      <section className="uploaders uploaders--single">
        <FileUploader
          label="Pending follow requests file"
          hint="pending_follow_requests.json"
          file={file}
          count={people?.length}
          onFile={handleFile}
        />
      </section>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {isProcessing && (
        <section className="progress">
          <div className="progress__label">Building your checklist…</div>
          <div className="progress__track">
            <div className="progress__fill" style={{ width: `${progress}%` }} />
          </div>
        </section>
      )}

      {downloadUrl && (
        <section className="results">
          <p className="results__count">
            <strong>{people.length}</strong> pending request{people.length === 1 ? '' : 's'} ready
            to review
          </p>
          <div className="results__actions">
            <a
              className="download-button"
              href={downloadUrl}
              download="instagram-pending-requests.html"
            >
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
