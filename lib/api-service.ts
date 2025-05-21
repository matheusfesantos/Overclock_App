"use client"

import { getToken } from "@/lib/auth-service"
import { API_URL } from "@/lib/constants"

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

  if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
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

// Peças API
export const getPecas = async () => {
  return apiRequest("api/pecas")
}

export const getPecaById = async (id: number) => {
  return apiRequest(`api/pecas/${id}`)
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

export const deleteFornecedor = async (id: number) => {
  return apiRequest(`api/fornecedores/${id}`, "DELETE")
}

// Usuários API
export const getUsuarios = async () => {
  return apiRequest("api/usuarios")
}

export const getUserDetails = async () => {
  return apiRequest("api/usuarios/me")
}

// Compras API
export const getCompras = async () => {
  return apiRequest("api/compras")
}

export const getCompraById = async (id: number) => {
  return apiRequest(`api/compras/${id}`)
}

export const createCompra = async (data: {
  observacao: string
  id_peça: string
  id_usuario: string
  id_fornecedor: string
}) => {
  return apiRequest("api/compras", "POST", data)
}

export const updateCompra = async (id: number, data: { observacao: string }) => {
  return apiRequest(`api/compras/${id}`, "PATCH", data)
}

export const deleteCompra = async (id: number) => {
  return apiRequest(`api/compras/${id}`, "DELETE")
}

// Pedidos API
export const getPedidos = async () => {
  return apiRequest("api/pedidos")
}

export const getPedidoById = async (id: number) => {
  return apiRequest(`api/pedidos/${id}`)
}

export const createPedido = async (data: any) => {
  return apiRequest("api/pedidos", "POST", data)
}

export const updatePedido = async (id: number, data: any) => {
  return apiRequest(`api/pedidos/${id}`, "PATCH", data)
}

export const deletePedido = async (id: number) => {
  return apiRequest(`api/pedidos/${id}`, "DELETE")
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
