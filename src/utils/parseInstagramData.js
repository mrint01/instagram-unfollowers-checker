// Instagram's data export nests usernames under string_list_data, and the
// top-level shape differs between followers (a plain array) and following
// (an object like { relationships_following: [...] }). Handle both.
export function extractUsernames(json) {
  let entries = json
  if (!Array.isArray(json)) {
    const arrayKey = Object.keys(json ?? {}).find((key) => Array.isArray(json[key]))
    entries = arrayKey ? json[arrayKey] : []
  }

  const usernames = new Map()
  for (const entry of entries ?? []) {
    const data = entry?.string_list_data?.[0]
    if (!data) continue
    const username = data.value || data.href?.split('/').filter(Boolean).pop()
    if (!username) continue
    usernames.set(username.toLowerCase(), {
      key: username.toLowerCase(),
      username,
      href: data.href || `https://www.instagram.com/${username}/`,
      timestamp: data.timestamp || 0,
    })
  }
  return usernames
}

export function parseInstagramFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result)
        resolve(extractUsernames(json))
      } catch (err) {
        reject(new Error(`"${file.name}" isn't valid Instagram JSON export data.`))
      }
    }
    reader.onerror = () => reject(new Error(`Couldn't read "${file.name}".`))
    reader.readAsText(file)
  })
}

export function findNotFollowingBack(followers, following) {
  const result = []
  for (const [key, value] of following) {
    if (!followers.has(key)) result.push(value)
  }
  return result.sort((a, b) => a.username.localeCompare(b.username))
}
