// Instagram double-encodes emoji/special characters in exported name fields.
// Re-interpreting the mangled UTF-8 string as latin-1 bytes and decoding
// those bytes as UTF-8 repairs it. If the string was never mangled (or isn't
// valid UTF-8 once reinterpreted), fall back to the original string.
export function fixMojibake(str) {
  if (!str) return str
  try {
    const codes = Array.from(str, (ch) => ch.charCodeAt(0))
    if (codes.some((code) => code > 255)) throw new Error('not latin-1')
    const bytes = Uint8Array.from(codes)
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return str
  }
}

// pending_follow_requests.json entries look like:
// { timestamp, label_values: [{ label: 'URL'|'Name'|'Username', value }], fbid }
export function extractPendingRequests(json) {
  let entries = json
  if (!Array.isArray(json)) {
    const arrayKey = Object.keys(json ?? {}).find((key) => Array.isArray(json[key]))
    entries = arrayKey ? json[arrayKey] : []
  }

  const people = []
  for (const entry of entries ?? []) {
    const labelValues = entry?.label_values ?? []
    const getValue = (label) => labelValues.find((lv) => lv?.label === label)?.value ?? ''
    const username = getValue('Username')
    if (!username) continue
    const name = fixMojibake(getValue('Name'))
    const timestamp = entry.timestamp ?? 0
    people.push({
      key: String(entry.fbid ?? username),
      name,
      username,
      href: `https://www.instagram.com/${username}/`,
      timestamp,
    })
  }
  return people.sort((a, b) => b.timestamp - a.timestamp)
}

export function parsePendingFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result)
        resolve(extractPendingRequests(json))
      } catch (err) {
        reject(new Error(`"${file.name}" isn't valid Instagram JSON export data.`))
      }
    }
    reader.onerror = () => reject(new Error(`Couldn't read "${file.name}".`))
    reader.readAsText(file)
  })
}
