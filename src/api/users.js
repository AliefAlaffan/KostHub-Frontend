import apiClient from './client'

export const getUsers = () => apiClient.get('/users').then((res) => res.data)
export const createStaff = (data) => apiClient.post('/users/staff', data).then((res) => res.data)
export const resetUserPassword = (id) => apiClient.post(`/users/${id}/reset-password`).then((res) => res.data)
export const toggleUserStatus = (id) => apiClient.patch(`/users/${id}/toggle-status`).then((res) => res.data)