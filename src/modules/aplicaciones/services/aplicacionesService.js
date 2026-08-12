import { httpClient } from '../../../shared/services/httpClient'
import { buildQueryString } from '../utils/queryParams'

const BASE_ENDPOINT = '/injection-applications'

export function calculateNextApplicationDate(payload) {
  return httpClient.post(`${BASE_ENDPOINT}/calculate`, payload)
}

export function createApplication(payload) {
  return httpClient.post(BASE_ENDPOINT, payload)
}

export function createApplicationSchedule(payload) {
  return httpClient.post(`${BASE_ENDPOINT}/schedules`, payload)
}

export function updateApplication(id, payload) {
  return httpClient.put(`${BASE_ENDPOINT}/${id}`, payload)
}

export function updateApplicationStatus(id, payload) {
  return httpClient.patch(`${BASE_ENDPOINT}/${id}/status`, payload)
}

export function updateApplicationDate(id, payload) {
  return httpClient.patch(`${BASE_ENDPOINT}/${id}/date`, payload)
}

export function getApplicationById(id) {
  return httpClient.get(`${BASE_ENDPOINT}/${id}`)
}

export function searchApplications(filters) {
  return httpClient.get(`${BASE_ENDPOINT}${buildQueryString(filters)}`)
}

export function getLastApplicationsByEye(patientId) {
  return httpClient.get(`${BASE_ENDPOINT}/patient/${patientId}/last-by-eye`)
}
