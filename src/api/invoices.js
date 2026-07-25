import apiClient from './client'

export const getInvoices = () => apiClient.get('/invoices').then((res) => res.data)
export const generateInvoice = (data) => apiClient.post('/invoices', data).then((res) => res.data)