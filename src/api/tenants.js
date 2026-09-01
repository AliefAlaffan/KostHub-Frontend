import apiClient from './client'

export const getTenants = (params = {}) =>
  apiClient.get('/tenants', { params }).then((res) => res.data)
export const createTenant = (data) => apiClient.post('/tenants', data).then((res) => res.data)
export const getTenant = (id) => apiClient.get(`/tenants/${id}`).then((res) => res.data)
export const uploadTenantDocument = (tenantId, formData) =>
  apiClient.post(`/tenants/${tenantId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data)

export const deleteTenantDocument = (tenantId, documentId) =>
  apiClient.delete(`/tenants/${tenantId}/documents/${documentId}`).then((res) => res.data)