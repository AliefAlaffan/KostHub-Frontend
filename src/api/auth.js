import apiClient from './client'

export const login = (identifier, password) =>
  apiClient.post('/auth/login', { email: identifier, password }).then((res) => res.data)

export const logout = () => apiClient.post('/auth/logout').then((res) => res.data)

export const getMe = () => apiClient.get('/auth/me').then((res) => res.data)

export const updateProfile = (data) => apiClient.put('/auth/profile', data).then((res) => res.data)
export const changePassword = (data) => apiClient.post('/auth/change-password', data).then((res) => res.data)