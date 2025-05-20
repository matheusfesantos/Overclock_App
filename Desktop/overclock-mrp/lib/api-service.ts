"use client"

import { getToken } from "@/lib/auth-service"
import { API_URL } from "@/lib/constants"

// Helper function to make authenticated API requests
const apiRequest = async (endpoint: string, method = "GET", body?: any) => {
  const token = getToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config: RequestInit = {
    method,
    headers,
  }

  if (body && (method === "POST" || method === "PUT")) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)
  const data = await response.json()

  if (data.status === "error") {
    throw new Error(data.message || "Erro na requisição")
  }

  return data.data
}

// Mock function for stats (since it's not in the API)
export const getStats = async () => {
  // This would be replaced with a real API call in production
  return {
    totalPecas: 156,
    totalFornecedores: 42,
    pecasPorCategoria: {
      Eletrônica: 35,
      Mecânica: 25,
      Elétrica: 20,
      Hidráulica: 15,
      Estrutural: 5,
    },
    fornecedoresPorEstado: {
      SP: 42,
      MG: 28,
      RJ: 23,
      PR: 19,
      SC: 15,
      RS: 12,
      BA: 8,
      PE: 5,
    },
  }
}

// Peças API

export const getPecas = async () => {
  return apiRequest("/pecas")
}

export const getPecaById = async (id: number) => {
  return apiRequest(`/pecas/${id}`)
}

export const createPeca = async (data: any) => {
  return apiRequest("/pecas", "POST", data)
}

export const updatePeca = async (id: number, data: any) => {
  return apiRequest(`/pecas/${id}`, "PUT", data)
}

export const deletePeca = async (id: number) => {
  return apiRequest(`/pecas/${id}`, "DELETE")
}

// Fornecedores API

export const getFornecedores = async () => {
  return apiRequest("/fornecedores")
}

export const getFornecedorById = async (id: number) => {
  return apiRequest(`/fornecedores/${id}`)
}

export const createFornecedor = async (data: any) => {
  return apiRequest("/fornecedores", "POST", data)
}

export const updateFornecedor = async (id: number, data: any) => {
  return apiRequest(`/fornecedores/${id}`, "PUT", data)
}

export const deleteFornecedor = async (id: number) => {
  return apiRequest(`/fornecedores/${id}`, "DELETE")
}
