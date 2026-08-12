export function PasswordChangeForm({
  error,
  form,
  loading,
  success,
  onChange,
  onSubmit,
}) {
  return (
    <section className="settings-panel" aria-labelledby="password-settings-title">
      <div className="settings-panel-heading">
        <div>
          <p className="settings-kicker">Seguridad</p>
          <h2 id="password-settings-title">Contraseña</h2>
        </div>
      </div>

      <form className="settings-form" onSubmit={onSubmit}>
        <label className="settings-field" htmlFor="current-password">
          <span>Contraseña actual</span>
          <input
            id="current-password"
            name="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={onChange}
            autoComplete="current-password"
            required
          />
        </label>

        <div className="settings-form-grid">
          <label className="settings-field" htmlFor="new-password">
            <span>Nueva contraseña</span>
            <input
              id="new-password"
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={onChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          <label className="settings-field" htmlFor="confirm-password">
            <span>Confirmar contraseña</span>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={onChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
        </div>

        {error ? <p className="settings-alert is-error">{error}</p> : null}
        {success ? <p className="settings-alert is-success">{success}</p> : null}

        <div className="settings-actions">
          <button
            className="settings-primary-action"
            type="submit"
            disabled={loading}
          >
            <i className="bi bi-shield-lock" aria-hidden="true" />
            {loading ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </form>
    </section>
  )
}
