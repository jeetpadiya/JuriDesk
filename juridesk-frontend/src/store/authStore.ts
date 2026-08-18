import { create } from "zustand"
import { authApi } from "@/lib/api/auth"

export interface User {
  id?: string
  _id?: string
  username?: string
  email: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  setAuth: (user: User) => void
  setUser: (user: User | null) => void
  logout: () => void
  checkAuth: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    }),

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
      isLoading: false,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      const response = await authApi.profile()
      if (response.success && response.user) {
        set({
          user: {
            id: response.user._id,
            _id: response.user._id,
            username: response.user.username,
            email: response.user.email,
          },
          isAuthenticated: true,
          isLoading: false,
        })
        return true
      }
    } catch {
      // Session cookie is invalid or expired
    }

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
    return false
  },
}))

export default useAuthStore
