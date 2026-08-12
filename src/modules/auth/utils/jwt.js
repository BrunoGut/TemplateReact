function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  return atob(padded)
}

export function getJwtPayload(token) {
  const [, payload] = token.split('.')

  if (!payload) {
    return null
  }

  try {
    return JSON.parse(decodeBase64Url(payload))
  } catch {
    return null
  }
}

export function getInternalUserFromToken(token) {
  const payload = getJwtPayload(token)

  if (!payload) {
    return null
  }

  const role =
    payload.role ||
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

  return {
    id: payload.sub,
    email: payload.email,
    fullName: payload.fullName,
    role,
  }
}
