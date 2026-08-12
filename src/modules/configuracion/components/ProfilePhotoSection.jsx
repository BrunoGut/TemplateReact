function getRoleLabel(role) {
  if (role === 'Admin') {
    return 'Administrador'
  }

  if (role === 'Doctor') {
    return 'Medico'
  }

  return 'Usuario interno'
}

export function ProfilePhotoSection({
  photoFileName,
  photoPreview,
  user,
  userInitials,
  onPhotoChange,
  onPhotoReset,
}) {
  const displayName = user?.fullName || user?.email || 'Usuario interno'

  return (
    <section className="settings-panel" aria-labelledby="profile-settings-title">
      <div className="settings-panel-heading">
        <div>
          <p className="settings-kicker">Perfil</p>
          <h2 id="profile-settings-title">Foto y datos</h2>
        </div>
      </div>

      <div className="profile-settings">
        <div className="profile-avatar" aria-hidden="true">
          {photoPreview ? (
            <img src={photoPreview} alt="" />
          ) : (
            <span>{userInitials}</span>
          )}
        </div>

        <div className="profile-summary">
          <h3>{displayName}</h3>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{user?.email || 'No disponible'}</dd>
            </div>
            <div>
              <dt>Rol</dt>
              <dd>{getRoleLabel(user?.role)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="settings-actions">
        <input
          id="profile-photo-input"
          className="settings-file-input"
          type="file"
          accept="image/*"
          onChange={onPhotoChange}
        />
        <label className="settings-secondary-action" htmlFor="profile-photo-input">
          <i className="bi bi-image" aria-hidden="true" />
          Cambiar foto
        </label>
        <button
          className="settings-primary-action"
          type="button"
          disabled
          title="Pendiente de integracion"
        >
          <i className="bi bi-cloud-arrow-up" aria-hidden="true" />
          Guardar foto
        </button>
        {photoPreview ? (
          <button
            className="settings-icon-action"
            type="button"
            onClick={onPhotoReset}
            aria-label="Quitar vista previa"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {photoFileName ? (
        <p className="settings-inline-status">{photoFileName}</p>
      ) : null}
    </section>
  )
}
