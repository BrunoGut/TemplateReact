import { AccessTabs } from '../components/AccessTabs'
import { InternalLoginForm } from '../components/InternalLoginForm'
import { PatientLoginForm } from '../components/PatientLoginForm'
import { useLogin } from '../hooks/useLogin'
import './LoginPage.css'

export function LoginPage() {
  const {
    activeAccess,
    error,
    internalForm,
    loading,
    patientForm,
    handleAccessChange,
    handleInternalChange,
    handleInternalSubmit,
    handlePatientChange,
    handlePatientSubmit,
  } = useLogin()

  return (
    <main className="login-page">
      <section className="login-hero" aria-labelledby="login-title">
        <div>
          <p className="eyebrow">Acceso seguro</p>
          <h1 id="login-title">Sistema clinico</h1>
          <p>
            Ingreso diferenciado para administradores, medicos y pacientes con
            credenciales propias.
          </p>
        </div>
      </section>

      <section className="login-panel" aria-label="Formulario de ingreso">
        <div className="panel-heading">
          <p className="eyebrow">Iniciar sesion</p>
          <h2>
            {activeAccess === 'internal'
              ? 'Usuarios internos'
              : 'Portal de pacientes'}
          </h2>
        </div>

        <AccessTabs
          activeAccess={activeAccess}
          onAccessChange={handleAccessChange}
        />

        {activeAccess === 'internal' ? (
          <InternalLoginForm
            form={internalForm}
            loading={loading}
            error={error}
            onChange={handleInternalChange}
            onSubmit={handleInternalSubmit}
          />
        ) : (
          <PatientLoginForm
            form={patientForm}
            loading={loading}
            error={error}
            onChange={handlePatientChange}
            onSubmit={handlePatientSubmit}
          />
        )}
      </section>
    </main>
  )
}
