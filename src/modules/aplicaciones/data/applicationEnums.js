export const EYES = [
  { value: 1, label: 'OD', description: 'Ojo derecho' },
  { value: 2, label: 'OI', description: 'Ojo izquierdo' },
]

export const APPLICATION_STATUSES = [
  { value: 1, label: 'Pendiente', code: 'Pending' },
  { value: 2, label: 'Aplicada', code: 'Applied' },
  { value: 3, label: 'Reprogramada', code: 'Rescheduled' },
  { value: 4, label: 'Cancelada', code: 'Cancelled' },
  { value: 5, label: 'No asistio', code: 'DidNotAttend' },
]

export const DATA_ORIGINS = [
  { value: 1, label: 'Manual historico', code: 'ManualHistorico' },
  { value: 2, label: 'Sistema', code: 'Sistema' },
  { value: 3, label: 'Modificado medico', code: 'ModificadoMedico' },
  { value: 4, label: 'Modificado admin', code: 'ModificadoAdmin' },
]

export const STATUS_BADGE_CLASS_BY_VALUE = {
  1: 'is-pending',
  2: 'is-applied',
  3: 'is-rescheduled',
  4: 'is-cancelled',
  5: 'is-absent',
}

export function getEyeLabel(value) {
  return EYES.find((eye) => eye.value === Number(value))?.label ?? '-'
}

export function getStatusLabel(value) {
  return (
    APPLICATION_STATUSES.find((status) => status.value === Number(value))?.label ??
    '-'
  )
}

export function getDataOriginLabel(value) {
  return DATA_ORIGINS.find((origin) => origin.value === Number(value))?.label ?? '-'
}
