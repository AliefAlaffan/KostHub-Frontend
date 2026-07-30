import apiClient from './client'

export const getReviews = (propertyId) => apiClient.get(`/properties/${propertyId}/reviews`).then((res) => res.data)
export const createReview = (propertyId, data) => apiClient.post(`/properties/${propertyId}/reviews`, data).then((res) => res.data)
export const replyReview = (reviewId, ownerReply) =>
  apiClient.post(`/reviews/${reviewId}/reply`, { owner_reply: ownerReply }).then((res) => res.data)