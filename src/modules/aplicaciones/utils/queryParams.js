export function buildQueryString(params) {
  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      queryParams.set(key, value)
    }
  })

  const queryString = queryParams.toString()
  return queryString ? `?${queryString}` : ''
}
