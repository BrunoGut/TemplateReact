import { httpClient } from '../../../shared/services/httpClient'

export function loginInternalUser(credentials) {
  return httpClient.post('/auth/login', credentials)
}

export function loginPatientAccess(accessData) {
  return httpClient.post('/patient-access', accessData)
}
