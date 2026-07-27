import apiClient from './client'

export const createPayment = (invoiceId, data) =>
  apiClient.post(`/invoices/${invoiceId}/payments`, data).then((res) => res.data)

export const verifyPayment = (paymentId) =>
  apiClient.patch(`/payments/${paymentId}/verify`).then((res) => res.data)

export const rejectPayment = (paymentId, reason) =>
  apiClient.patch(`/payments/${paymentId}/reject`, { reason }).then((res) => res.data)