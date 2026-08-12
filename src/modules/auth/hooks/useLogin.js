import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginInternalUser, loginPatientAccess } from '../services/authService'
import { saveInternalSession, savePatientSession } from '../utils/authStorage'
import { getInternalUserFromToken } from '../utils/jwt'

const initialInternalForm = {
  email: '',
  password: '',
}

const initialPatientForm = {
  dni: '',
  dateOfBirth: '',
}

function getInternalRedirectPath(role) {
  if (role === 'Admin') {
    return '/admin'
  }

  if (role === 'Doctor') {
    return '/medico'
  }

  return '/login'
}

export function useLogin() {
  const navigate = useNavigate()
  const [activeAccess, setActiveAccess] = useState('internal')
  const [internalForm, setInternalForm] = useState(initialInternalForm)
  const [patientForm, setPatientForm] = useState(initialPatientForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleAccessChange(accessType) {
    setActiveAccess(accessType)
    setError('')
  }

  function handleInternalChange(event) {
    const { name, value } = event.target
    setInternalForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  function handlePatientChange(event) {
    const { name, value } = event.target
    setPatientForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  async function handleInternalSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const authResponse = await loginInternalUser(internalForm)
      const user = getInternalUserFromToken(authResponse.accessToken)

      if (!user?.role || !['Admin', 'Doctor'].includes(user.role)) {
        throw new Error('El usuario no tiene un rol interno valido.')
      }

      saveInternalSession(authResponse, user)
      navigate(getInternalRedirectPath(user.role), { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  async function handlePatientSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const authResponse = await loginPatientAccess(patientForm)
      savePatientSession(authResponse)
      navigate('/portal-paciente', { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  return {
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
  }
}
