export function InternalLoginForm({
  form,
  loading,
  error,
  onChange,
  onSubmit,
}) {
  return (
    <form className="login-form" onSubmit={onSubmit}>
      <div className="form-field">
        <label htmlFor="internal-email">Email</label>
        <input
          id="internal-email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          autoComplete="email"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="internal-password">Password</label>
        <input
          id="internal-password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          autoComplete="current-password"
          required
        />
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="primary-action" type="submit" disabled={loading}>
        <i className="bi bi-box-arrow-in-right" aria-hidden="true"></i>
        {loading ? 'Ingresando...' : 'Ingresar al sistema'}
      </button>
    </form>
  )
}
