import { useRef, useState } from 'react'

export default function FileUploader({ label, hint, file, count, onFile }) {
  const inputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFiles = (files) => {
    if (files?.[0]) onFile(files[0])
  }

  return (
    <div
      className={`uploader ${isDragOver ? 'uploader--dragover' : ''} ${file ? 'uploader--done' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        handleFiles(e.dataTransfer.files)
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="uploader__icon">{file ? '✅' : '📄'}</div>
      <div className="uploader__label">{label}</div>
      {file ? (
        <div className="uploader__file">
          {file.name} · {count} accounts
        </div>
      ) : (
        <div className="uploader__hint">{hint}</div>
      )}
    </div>
  )
}
