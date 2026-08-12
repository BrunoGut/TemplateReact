const themeOptions = [
  { icon: 'bi-sun', label: 'Claro', value: 'light' },
  { icon: 'bi-moon-stars', label: 'Oscuro', value: 'dark' },
  { icon: 'bi-circle-half', label: 'Sistema', value: 'system' },
]

function getResolvedLabel(resolvedThemeMode) {
  return resolvedThemeMode === 'dark' ? 'Oscuro' : 'Claro'
}

export function ThemeModeSelector({
  resolvedThemeMode,
  themeMode,
  onThemeModeChange,
}) {
  return (
    <section className="settings-panel" aria-labelledby="theme-settings-title">
      <div className="settings-panel-heading">
        <div>
          <p className="settings-kicker">Apariencia</p>
          <h2 id="theme-settings-title">Modo</h2>
        </div>
        <span className="settings-badge">{getResolvedLabel(resolvedThemeMode)}</span>
      </div>

      <div className="theme-selector" role="group" aria-label="Modo visual">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            className={option.value === themeMode ? 'is-active' : ''}
            type="button"
            aria-pressed={option.value === themeMode}
            onClick={() => onThemeModeChange(option.value)}
          >
            <i className={`bi ${option.icon}`} aria-hidden="true" />
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
