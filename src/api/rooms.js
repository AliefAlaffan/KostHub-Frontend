import apiClient from './client'

export const getRooms = (propertyId) =>
  apiClient.get('/rooms', { params: propertyId ? { property_id: propertyId } : {} }).then((res) => res.data)

export const createRoom = (data) => apiClient.post('/rooms', data).then((res) => res.data)

export const updateRoomStatus = (id, status) =>
  apiClient.patch(`/rooms/${id}/status`, { status }).then((res) => res.data)