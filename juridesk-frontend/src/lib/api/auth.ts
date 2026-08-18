import { apiClient } from "@/lib/api/client"

export type AuthResponse = {
  success: boolean
  message: string
}

export type RegisterInput = {
  username: string
  email: string
  password: string
}

export type LoginInput = {
  email: string
  password: string
}

export type LoginResponse = AuthResponse & {
  user: {
    id: string
    email: string
    token: string
  }
}

export type UserProfile = {
  _id: string
  username: string
  email: string
}

export const authApi = {
  register: (input: RegisterInput) =>
    apiClient.post<AuthResponse>("/api/auth/register", input),

  login: (input: LoginInput) =>
    apiClient.post<LoginResponse>("/api/auth/login", input),

  profile: () =>
    apiClient.get<{ success: boolean; user: UserProfile }>("/api/auth/profile"),
}
