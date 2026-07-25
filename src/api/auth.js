import apiClient from './client'

export const login = (identifier, password) =>
  apiClient.post('/auth/login', { email: identifier, password }).then((res) => res.data)

export const logout = () => apiClient.post('/auth/logout').then((res) => res.data)