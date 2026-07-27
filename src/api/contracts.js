import apiClient from './client'

export const getContracts = () => apiClient.get('/contracts').then((res) => res.data)
export const getContract = (id) => apiClient.get(`/contracts/${id}`).then((res) => res.data)
export const renewContract = (id, data) => apiClient.post(`/contracts/${id}/renew`, data).then((res) => res.data)
export const checkoutContract = (id, data) => apiClient.post(`/contracts/${id}/checkout`, data).then((res) => res.data)