import { httpClient } from '../../../shared/services/httpClient'

export function changeInternalPassword(passwordData) {
  return httpClient.patch('/auth/password', {
    currentPassword: passwordData.currentPassword,
    newPassword: passwordData.newPassword,
  })
}
