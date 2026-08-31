import apiClient from './client'

export const getProperties = () => apiClient.get('/properties').then((res) => res.data)
export const createProperty = (data) => apiClient.post('/properties', data).then((res) => res.data)
export const uploadQris = (propertyId, formData) =>
  apiClient.post(`/properties/${propertyId}/qris`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data)

export const deleteQris = (propertyId) =>
  apiClient.delete(`/properties/${propertyId}/qris`).then((res) => res.data)