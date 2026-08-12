import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeMode } from '../../../shared/hooks/useThemeMode'
import {
  clearAuthSession,
  getInternalSession,
} from '../../auth/utils/authStorage'
import { changeInternalPassword } from '../services/configuracionService'

const initialPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

function getInitials(user) {
  const source = user?.fullName || user?.email || 'Usuario interno'
  const words = source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)

  return words.map((word) => word[0]?.toUpperCase()).join('') || 'UI'
}

function validatePasswordForm(form) {
  if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
    return 'Completá todos los campos de contraseña.'
  }

  if (form.newPassword.length < 8) {
    return 'La nueva contraseña debe tener al menos 8 caracteres.'
  }

  if (form.newPassword !== form.confirmPassword) {
    return 'La confirmación no coincide con la nueva contraseña.'
  }

  if (form.currentPassword === form.newPassword) {
    return 'La nueva contraseña debe ser distinta de la actual.'
  }

  return ''
}

export function useConfiguracion() {
  const navigate = useNavigate()
  const session = getInternalSession()
  const user = session?.user ?? null
  const userInitials = useMemo(() => getInitials(user), [user])
  const { resolvedThemeMode, setThemeMode, themeMode } = useThemeMode()
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [photoPreview, setPhotoPreview] = useState('')
  const [photoFileName, setPhotoFileName] = useState('')

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview])

  function handlePasswordChange(event) {
    const { name, value } = event.target
    setPasswordForm((currentForm) => ({ ...currentForm, [name]: value }))
    setPasswordError('')
    setPasswordSuccess('')
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()

    const validationMessage = validatePasswordForm(passwordForm)

    if (validationMessage) {
      setPasswordError(validationMessage)
      setPasswordSuccess('')
      return
    }

    setSavingPassword(true)
    setPasswordError('')
    setPasswordSuccess('')

    try {
      await changeInternalPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm(initialPasswordForm)
      setPasswordSuccess('Contraseña actualizada correctamente.')
    } catch (error) {
      setPasswordError(error.message)
    } finally {
      setSavingPassword(false)
    }
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setPhotoPreview(URL.createObjectURL(file))
    setPhotoFileName(file.name)
  }

  function handlePhotoReset() {
    setPhotoPreview('')
    setPhotoFileName('')
  }

  function handleLogout() {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  return {
    photoFileName,
    photoPreview,
    passwordError,
    passwordForm,
    passwordSuccess,
    resolvedThemeMode,
    savingPassword,
    themeMode,
    user,
    userInitials,
    handleLogout,
    handlePasswordChange,
    handlePasswordSubmit,
    handlePhotoChange,
    handlePhotoReset,
    setThemeMode,
  }
}
