import { httpClient } from '../../../shared/services/httpClient'
import { buildQueryString } from '../utils/queryParams'

function getCollection(response) {
  if (Array.isArray(response)) {
    return response
  }

  return response?.items ?? response?.data ?? response?.results ?? []
}

function normalizePatient(patient) {
  const firstName = patient.firstName ?? patient.name ?? patient.nombre ?? ''
  const lastName = patient.lastName ?? patient.surname ?? patient.apellido ?? ''
  const fullName =
    patient.fullName ??
    patient.patientFullName ??
    patient.nombreCompleto ??
    `${firstName} ${lastName}`.trim()

  return {
    id: patient.id ?? patient.patientId,
    fullName,
    dni: patient.dni ?? patient.documentNumber ?? patient.patientDni ?? '',
    medicalRecordNumber:
      patient.medicalRecordNumber ?? patient.patientMedicalRecordNumber ?? '',
  }
}

function normalizeDrug(drug) {
  return {
    id: drug.id ?? drug.drugId,
    name: drug.name ?? drug.drugName ?? drug.nombre ?? '',
    isActive: drug.isActive ?? drug.active ?? true,
  }
}

export async function searchPatients(term) {
  const response = await httpClient.get(`/patients${buildQueryString({ search: term })}`)
  return getCollection(response).map(normalizePatient).filter((patient) => patient.id)
}

export async function searchDrugs(term) {
  const response = await httpClient.get(
    `/drugs${buildQueryString({ name: term, isActive: true })}`,
  )
  return getCollection(response).map(normalizeDrug).filter((drug) => drug.id)
}
