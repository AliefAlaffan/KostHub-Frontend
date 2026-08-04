import apiClient from './client'

export const getTenants = () => apiClient.get('/tenants').then((res) => res.data)
export const createTenant = (data) => apiClient.post('/tenants', data).then((res) => res.data)
export const getTenant = (id) => apiClient.get(`/tenants/${id}`).then((res) => res.data)