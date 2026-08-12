export function SessionActions({ onLogout }) {
  return (
    <section className="settings-panel" aria-labelledby="session-settings-title">
      <div className="settings-panel-heading">
        <div>
          <p className="settings-kicker">Sesion</p>
          <h2 id="session-settings-title">Acceso</h2>
        </div>
      </div>

      <button className="settings-danger-action" type="button" onClick={onLogout}>
        <i className="bi bi-box-arrow-right" aria-hidden="true" />
        Cerrar sesion
      </button>
    </section>
  )
}
