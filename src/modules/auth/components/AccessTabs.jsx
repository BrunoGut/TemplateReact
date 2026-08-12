export function AccessTabs({ activeAccess, onAccessChange }) {
  return (
    <div className="access-tabs" aria-label="Tipo de ingreso">
      <button
        type="button"
        className={activeAccess === 'internal' ? 'active' : ''}
        onClick={() => onAccessChange('internal')}
      >
        <i className="bi bi-person-badge" aria-hidden="true"></i>
        Administradores y medicos
      </button>
      <button
        type="button"
        className={activeAccess === 'patient' ? 'active' : ''}
        onClick={() => onAccessChange('patient')}
      >
        <i className="bi bi-heart-pulse" aria-hidden="true"></i>
        Portal de pacientes
      </button>
    </div>
  )
}
