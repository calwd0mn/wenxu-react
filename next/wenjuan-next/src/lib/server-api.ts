const FALLBACK_API_BASE_URL = 'http://127.0.0.1:3003'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

export function getServerApiBaseUrl() {
  const envValue =
    process.env.SERVER_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || ''

  if (!envValue.trim()) {
    return FALLBACK_API_BASE_URL
  }

  return trimTrailingSlash(envValue.trim())
}

export function createServerApiUrl(path: string) {
  const baseUrl = getServerApiBaseUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}
