import { PasswordChangeForm } from '../components/PasswordChangeForm'
import { ProfilePhotoSection } from '../components/ProfilePhotoSection'
import { SessionActions } from '../components/SessionActions'
import { ThemeModeSelector } from '../components/ThemeModeSelector'
import { useConfiguracion } from '../hooks/useConfiguracion'
import './ConfiguracionPage.css'

export function ConfiguracionPage() {
  const configuracion = useConfiguracion()

  return (
    <div className="settings-page">
      <header className="settings-header">
        <div>
          <p className="settings-kicker">Cuenta</p>
          <h1>Configuracion</h1>
        </div>
      </header>

      <div className="settings-layout">
        <div className="settings-main-stack">
          <ProfilePhotoSection
            photoFileName={configuracion.photoFileName}
            photoPreview={configuracion.photoPreview}
            user={configuracion.user}
            userInitials={configuracion.userInitials}
            onPhotoChange={configuracion.handlePhotoChange}
            onPhotoReset={configuracion.handlePhotoReset}
          />

          <PasswordChangeForm
            error={configuracion.passwordError}
            form={configuracion.passwordForm}
            loading={configuracion.savingPassword}
            success={configuracion.passwordSuccess}
            onChange={configuracion.handlePasswordChange}
            onSubmit={configuracion.handlePasswordSubmit}
          />
        </div>

        <aside className="settings-side-stack">
          <ThemeModeSelector
            resolvedThemeMode={configuracion.resolvedThemeMode}
            themeMode={configuracion.themeMode}
            onThemeModeChange={configuracion.setThemeMode}
          />

          <SessionActions onLogout={configuracion.handleLogout} />
        </aside>
      </div>
    </div>
  )
}
