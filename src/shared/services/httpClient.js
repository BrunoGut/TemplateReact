const API_URL = import.meta.env.VITE_API_URL;
const INTERNAL_SESSION_KEY = 'internalAuthSession'
const PATIENT_SESSION_KEY = 'patientAuthSession'

function getStoredSessionToken() {
  const sessionKeys = [INTERNAL_SESSION_KEY, PATIENT_SESSION_KEY]

  for (const sessionKey of sessionKeys) {
    const rawSession = localStorage.getItem(sessionKey)

    if (!rawSession) {
      continue
    }

    try {
      const session = JSON.parse(rawSession)

      if (session?.accessToken && (!session.expiresAt || session.expiresAt > Date.now())) {
        return session.accessToken
      }
    } catch {
      localStorage.removeItem(sessionKey)
    }
  }

  return null
}

async function request(endpoint, options = {}) {
  const token = getStoredSessionToken()
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    const message =
      errorData?.message ||
      errorData?.title ||
      "Ocurrió un error al comunicarse con el servidor";

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const httpClient = {
  get(endpoint) {
    return request(endpoint, {
      method: "GET",
    });
  },

  post(endpoint, body) {
    return request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body) {
    return request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  patch(endpoint, body) {
    return request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return request(endpoint, {
      method: "DELETE",
    });
  },
};
