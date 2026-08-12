const INTERNAL_SESSION_KEY = 'internalAuthSession'
const PATIENT_SESSION_KEY = 'patientAuthSession'

function buildSessionPayload(authResponse, extraData = {}) {
  const expiresAt = Date.now() + authResponse.expiresInSeconds * 1000

  return {
    accessToken: authResponse.accessToken,
    tokenType: authResponse.tokenType,
    expiresInSeconds: authResponse.expiresInSeconds,
    expiresAt,
    ...extraData,
  }
}

export function saveInternalSession(authResponse, userData) {
  const session = buildSessionPayload(authResponse, { user: userData })
  localStorage.setItem(INTERNAL_SESSION_KEY, JSON.stringify(session))
  localStorage.removeItem(PATIENT_SESSION_KEY)
  return session
}

export function savePatientSession(authResponse) {
  const session = buildSessionPayload(authResponse, {
    patientId: authResponse.patientId,
  })
  localStorage.setItem(PATIENT_SESSION_KEY, JSON.stringify(session))
  localStorage.removeItem(INTERNAL_SESSION_KEY)
  return session
}

export function getInternalSession() {
  const rawSession = localStorage.getItem(INTERNAL_SESSION_KEY)

  if (!rawSession) {
    return null
  }

  try {
    const session = JSON.parse(rawSession)

    if (session.expiresAt && session.expiresAt <= Date.now()) {
      localStorage.removeItem(INTERNAL_SESSION_KEY)
      return null
    }

    return session
  } catch {
    localStorage.removeItem(INTERNAL_SESSION_KEY)
    return null
  }
}

export function clearAuthSession() {
  localStorage.removeItem(INTERNAL_SESSION_KEY)
  localStorage.removeItem(PATIENT_SESSION_KEY)
}
