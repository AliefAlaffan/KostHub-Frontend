import apiClient from './client'

export const getMaintenanceRequests = () => apiClient.get('/maintenance-requests').then((res) => res.data)
export const createMaintenanceRequest = (data) => apiClient.post('/maintenance-requests', data).then((res) => res.data)
export const updateMaintenanceStatus = (id, data) =>
  apiClient.patch(`/maintenance-requests/${id}/status`, data).then((res) => res.data)