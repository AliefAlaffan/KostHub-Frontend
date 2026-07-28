import apiClient from './client'

export const getAnnouncements = () => apiClient.get('/announcements').then((res) => res.data)
export const createAnnouncement = (data) => apiClient.post('/announcements', data).then((res) => res.data)