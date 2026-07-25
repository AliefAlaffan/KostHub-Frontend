import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('auth_token') || null,
  isAuthenticated: !!localStorage.getItem('auth_token'),

  setAuth: (user, token) => {
    localStorage.setItem('auth_token', token)
    set({ user, token, isAuthenticated: true })
  },

  clearAuth: () => {
    localStorage.removeItem('auth_token')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))