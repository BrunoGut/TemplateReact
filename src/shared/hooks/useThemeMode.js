import { useCallback, useEffect, useState } from 'react'
import {
  SYSTEM_THEME_QUERY,
  applyThemeMode,
  getSystemThemeMode,
  getStoredThemeMode,
  isThemeMode,
  setStoredThemeMode,
} from '../utils/themeMode'

export function useThemeMode() {
  const [themeMode, setThemeModeState] = useState(() => getStoredThemeMode())
  const [systemThemeMode, setSystemThemeMode] = useState(() => getSystemThemeMode())
  const resolvedThemeMode =
    themeMode === 'system' ? systemThemeMode : themeMode

  useEffect(() => {
    applyThemeMode(themeMode)
  }, [themeMode, systemThemeMode])

  useEffect(() => {
    if (!window.matchMedia) {
      return undefined
    }

    const mediaQueryList = window.matchMedia(SYSTEM_THEME_QUERY)
    const handleSystemThemeChange = () => {
      setSystemThemeMode(getSystemThemeMode())
    }

    mediaQueryList.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQueryList.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  const setThemeMode = useCallback((nextThemeMode) => {
    if (!isThemeMode(nextThemeMode)) {
      return
    }

    setStoredThemeMode(nextThemeMode)
    setThemeModeState(nextThemeMode)
  }, [])

  return {
    resolvedThemeMode,
    setThemeMode,
    themeMode,
  }
}
