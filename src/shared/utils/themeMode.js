const THEME_MODE_KEY = 'themeMode'
const THEME_MODES = ['light', 'dark', 'system']
const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)'

export function isThemeMode(value) {
  return THEME_MODES.includes(value)
}

export function getStoredThemeMode() {
  try {
    const storedMode = localStorage.getItem(THEME_MODE_KEY)
    return isThemeMode(storedMode) ? storedMode : 'system'
  } catch {
    return 'system'
  }
}

export function setStoredThemeMode(themeMode) {
  if (!isThemeMode(themeMode)) {
    return
  }

  try {
    localStorage.setItem(THEME_MODE_KEY, themeMode)
  } catch {
    // The visual preference can still apply for the current session.
  }
}

export function getSystemThemeMode() {
  if (!window.matchMedia) {
    return 'light'
  }

  return window.matchMedia(SYSTEM_THEME_QUERY).matches ? 'dark' : 'light'
}

export function getResolvedThemeMode(themeMode) {
  return themeMode === 'system' ? getSystemThemeMode() : themeMode
}

export function applyThemeMode(themeMode) {
  const normalizedThemeMode = isThemeMode(themeMode) ? themeMode : 'system'
  const resolvedThemeMode = getResolvedThemeMode(normalizedThemeMode)

  document.documentElement.dataset.themeMode = normalizedThemeMode
  document.documentElement.dataset.theme = resolvedThemeMode

  return resolvedThemeMode
}

export function initializeThemeMode() {
  return applyThemeMode(getStoredThemeMode())
}

export { SYSTEM_THEME_QUERY }
