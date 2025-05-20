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

  const response = await fetch(`${API_URL}/${endpoint}`, config)
  const data = await response.json()

  if (data.status === "error") {
    throw new Error(data.message || "Erro na requisição")
  }

  // If data is an array, return it directly
  if (Array.isArray(data)) {
    return data
  }

  // Otherwise, return data.data if it exists, or data itself
  return data.data || data
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
  return apiRequest("api/pecas")
}

export const getPecaById = async (id: number) => {
  return apiRequest(`api/pecas/${id}`)
}

// Nota: POST apenas para login, estas funções estão desabilitadas
export const createPeca = async (data: any) => {
  console.warn("Operação POST não suportada pela API")
  throw new Error("Operação não suportada")
}

export const updatePeca = async (id: number, data: any) => {
  console.warn("Operação PUT não suportada pela API")
  throw new Error("Operação não suportada")
}

export const deletePeca = async (id: number) => {
  return apiRequest(`api/pecas/${id}`, "DELETE")
}

// Fornecedores API

export const getFornecedores = async () => {
  return apiRequest("api/fornecedores")
}

export const getFornecedorById = async (id: number) => {
  return apiRequest(`api/fornecedores/${id}`)
}

// Nota: POST apenas para login, estas funções estão desabilitadas
export const createFornecedor = async (data: any) => {
  console.warn("Operação POST não suportada pela API")
  throw new Error("Operação não suportada")
}

export const updateFornecedor = async (id: number, data: any) => {
  console.warn("Operação PUT não suportada pela API")
  throw new Error("Operação não suportada")
}

export const deleteFornecedor = async (id: number) => {
  return apiRequest(`api/fornecedores/${id}`, "DELETE")
}

// Usuários API
export const getUsuarios = async () => {
  return apiRequest("api/usuarios")
}

// Helper function to fix encoding issues in text
export const fixEncoding = (text: string): string => {
  if (!text) return ""

  // Replace common encoding issues
  return text
    .replace(/Æ/g, "ã")
    .replace(/¡/g, "í")
    .replace(/¢/g, "ó")
    .replace(/£/g, "ú")
    .replace(/‡Æ/g, "çã")
    .replace(/‡/g, "ç")
    .replace(/ƒ/g, "â")
    .replace(/¤/g, "ê")
    .replace(/¥/g, "é")
    .replace(/¦/g, "ê")
    .replace(/§/g, "ç")
    .replace(/¨/g, "è")
    .replace(/©/g, "é")
    .replace(/ª/g, "ê")
    .replace(/«/g, "ë")
    .replace(/¬/g, "ì")
    .replace(/­/g, "í")
    .replace(/®/g, "î")
    .replace(/¯/g, "ï")
    .replace(/°/g, "ð")
    .replace(/±/g, "ñ")
    .replace(/²/g, "ò")
    .replace(/³/g, "ó")
    .replace(/´/g, "ô")
    .replace(/µ/g, "õ")
    .replace(/¶/g, "ö")
    .replace(/·/g, "÷")
    .replace(/¸/g, "ø")
    .replace(/¹/g, "ù")
    .replace(/º/g, "ú")
    .replace(/»/g, "û")
    .replace(/¼/g, "ü")
    .replace(/½/g, "ý")
    .replace(/¾/g, "þ")
    .replace(/¿/g, "ÿ")
    .replace(/ä/g, "á")
    .replace(/Ä/g, "Á")
    .replace(/ö/g, "ó")
    .replace(/Ö/g, "Ó")
    .replace(/ü/g, "ú")
    .replace(/Ü/g, "Ú")
    .replace(/ß/g, "ß")
    .replace(/‚/g, "á")
    .replace(/„/g, "ä")
    .replace(/…/g, "à")
    .replace(/†/g, "æ")
    .replace(/‡/g, "ç")
    .replace(/ˆ/g, "è")
    .replace(/‰/g, "é")
    .replace(/Š/g, "ê")
    .replace(/‹/g, "ë")
    .replace(/Œ/g, "ì")
    .replace(/Ž/g, "î")
    .replace(/'/g, "ñ")
    .replace(/'/g, "ò")
    .replace(/"/g, "ó")
    .replace(/"/g, "ô")
    .replace(/•/g, "õ")
    .replace(/–/g, "ö")
    .replace(/—/g, "÷")
    .replace(/˜/g, "ø")
    .replace(/™/g, "ù")
    .replace(/š/g, "ú")
    .replace(/›/g, "û")
    .replace(/œ/g, "ü")
    .replace(/ž/g, "þ")
    .replace(/Ÿ/g, "ÿ")
}
