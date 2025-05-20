"use client"

import { useState, useEffect } from "react"
import { API_URL } from "@/lib/constants"

interface UserInfo {
  id: number
  username: string
  nome: string
  email: string
  cpf: string
}

interface RegisterData {
  username: string
  senha: string
  nome: string
  email: string
  cpf: string
}

interface AuthResponse {
  status: string
  message: string
  data?: {
    token: string
    user: UserInfo
  }
}

// Store token in localStorage
const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
  }
}

// Get token from localStorage
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Store user info in localStorage
const setUserInfo = (userInfo: UserInfo) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userInfo", JSON.stringify(userInfo))
  }
}

// Get user info from localStorage
const getUserInfo = (): UserInfo | null => {
  if (typeof window !== "undefined") {
    const userInfo = localStorage.getItem("userInfo")
    return userInfo ? JSON.parse(userInfo) : null
  }
  return null
}

// Clear auth data from localStorage
const clearAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    localStorage.removeItem("userInfo")
  }
}

// Login user
export const loginUser = async (username: string, password: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, senha: password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Falha na autenticação. Verifique suas credenciais.")
    }

    const data = await response.json()

    if (data.token) {
      setToken(data.token)
      // Mock user info since the API doesn't return it
      const userInfo: UserInfo = {
        id: 1,
        username,
        nome: "Usuário Logado",
        email: "usuario@email.com",
        cpf: "12345678900",
      }
      setUserInfo(userInfo)
      return
    }

    throw new Error("Falha na autenticação. Verifique suas credenciais.")
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

// Register user
export const registerUser = async (userData: RegisterData): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error("Falha no registro. Verifique os dados e tente novamente.")
    }

    return
  } catch (error) {
    console.error("Register error:", error)
    throw error
  }
}

// Logout user
export const logout = async (): Promise<void> => {
  clearAuthData()
}

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const token = getToken()
  return !!token
}

// Hook to get user info
export const useUserInfo = () => {
  const [userInfo, setUserInfoState] = useState<UserInfo | null>(null)

  useEffect(() => {
    setUserInfoState(getUserInfo())
  }, [])

  return { userInfo }
}
