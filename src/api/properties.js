import apiClient from './client'

export const getProperties = () => apiClient.get('/properties').then((res) => res.data)
export const createProperty = (data) => apiClient.post('/properties', data).then((res) => res.data)