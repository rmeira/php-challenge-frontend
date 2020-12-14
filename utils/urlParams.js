export const getParam = (key) => {
  if (!window) return
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(key)
}

export const hasParam = (key) => {
  if (!window) return
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.has(key)
}
