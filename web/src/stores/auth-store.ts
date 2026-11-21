import { create } from 'zustand'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'manager' | 'sales_executive' | 'employee'
}

type AuthState = {
  user: AuthUser | null
  token: string | null
  setSession: (user: AuthUser, token: string) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setSession: (user, token) => set({ user, token }),
  clearSession: () => set({ user: null, token: null }),
}))
