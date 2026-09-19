import apiClient from './client'

export const getProperties = () => apiClient.get('/properties').then((res) => res.data)
export const getProperty = (id) => apiClient.get(`/properties/${id}`).then((res) => res.data)
export const createProperty = (data) => apiClient.post('/properties', data).then((res) => res.data)
export const updateProperty = (id, data) => apiClient.put(`/properties/${id}`, data).then((res) => res.data)
export const deleteProperty = (id) => apiClient.delete(`/properties/${id}`).then((res) => res.data)

export const uploadQris = (propertyId, formData) =>
  apiClient.post(`/properties/${propertyId}/qris`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data)

export const deleteQris = (propertyId) =>
  apiClient.delete(`/properties/${propertyId}/qris`).then((res) => res.data)

export const uploadPropertyPhoto = (propertyId, formData) =>
  apiClient.post(`/properties/${propertyId}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data)

export const deletePropertyPhoto = (propertyId) =>
  apiClient.delete(`/properties/${propertyId}/photo`).then((res) => res.data)