export function formatDate(dateValue) {
  if (!dateValue) {
    return '-'
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateValue))
}

export function formatDateTime(dateValue) {
  if (!dateValue) {
    return '-'
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateValue))
}

export function toDateInputValue(dateValue) {
  if (!dateValue) {
    return ''
  }

  return new Date(dateValue).toISOString().slice(0, 10)
}

export function toApiDate(dateValue) {
  if (!dateValue) {
    return null
  }

  return `${dateValue}T00:00:00`
}

export function emptyToNull(value) {
  return value === '' ? null : value
}

export function numberOrNull(value) {
  return value === '' || value === null || value === undefined ? null : Number(value)
}
