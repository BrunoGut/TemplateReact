export function PatientLoginForm({
  form,
  loading,
  error,
  onChange,
  onSubmit,
}) {
  return (
    <form className="login-form" onSubmit={onSubmit}>
      <div className="form-field">
        <label htmlFor="patient-dni">DNI</label>
        <input
          id="patient-dni"
          name="dni"
          type="text"
          value={form.dni}
          onChange={onChange}
          autoComplete="off"
          inputMode="numeric"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="patient-date-of-birth">Fecha de nacimiento</label>
        <input
          id="patient-date-of-birth"
          name="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          onChange={onChange}
          required
        />
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="primary-action" type="submit" disabled={loading}>
        <i className="bi bi-shield-check" aria-hidden="true"></i>
        {loading ? 'Validando...' : 'Ingresar al portal'}
      </button>
    </form>
  )
}
