export const useAccessToken = () => {
  const match = window.location.hash.match(/access_token=([a-zA-Z0-9_-]*)/)

  return match?.[1]
}
