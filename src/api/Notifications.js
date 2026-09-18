import apiClient from './client'

export const getNotifications = () => apiClient.get('/notifications').then((res) => res.data)
export const markNotificationRead = (id) => apiClient.post(`/notifications/${id}/read`).then((res) => res.data)
export const markAllNotificationsRead = () => apiClient.post('/notifications/read-all').then((res) => res.data)