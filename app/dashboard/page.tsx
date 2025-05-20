"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useUserInfo } from "@/lib/auth-service"
import { getPecas, getFornecedores, getCompras } from "@/lib/api-service"

export default function DashboardPage() {
  const { userInfo } = useUserInfo()
  const [currentDateTime, setCurrentDateTime] = useState("")
  const [totals, setTotals] = useState({
    pecas: 0,
    fornecedores: 0,
    compras: 0,
  })
  const [loading, setLoading] = useState(true)

  // Buscar dados para os totais
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        setLoading(true)
        const [pecasData, fornecedoresData, comprasData] = await Promise.all([
          getPecas(),
          getFornecedores(),
          getCompras(),
        ])

        setTotals({
          pecas: Array.isArray(pecasData) ? pecasData.length : 0,
          fornecedores: Array.isArray(fornecedoresData) ? fornecedoresData.length : 0,
          compras: Array.isArray(comprasData) ? comprasData.length : 0,
        })
      } catch (error) {
        console.error("Erro ao buscar totais:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTotals()
  }, [])

  // Atualizar data e hora a cada segundo
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "America/Sao_Paulo",
      }
      setCurrentDateTime(new Intl.DateTimeFormat("pt-BR", options).format(now))
    }

    // Atualizar imediatamente e depois a cada segundo
    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Olá, seja bem-vindo {userInfo?.nome || "Usuário"}!</h2>
            <p className="text-muted-foreground">{currentDateTime}</p>
          </div>
        </CardContent>
      </Card>

      {/* Cards de totais */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">Total de Peças</h3>
              {loading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              ) : (
                <p className="text-4xl font-bold">{totals.pecas}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">Total de Fornecedores</h3>
              {loading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              ) : (
                <p className="text-4xl font-bold">{totals.fornecedores}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">Total de Compras</h3>
              {loading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              ) : (
                <p className="text-4xl font-bold">{totals.compras}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-2">Acesso Rápido</h3>
          <ul className="space-y-2">
            <li>
              <a href="/dashboard/pecas" className="text-primary hover:underline">
                Gerenciar Peças
              </a>
            </li>
            <li>
              <a href="/dashboard/fornecedores" className="text-primary hover:underline">
                Gerenciar Fornecedores
              </a>
            </li>
            <li>
              <a href="/dashboard/compras" className="text-primary hover:underline">
                Gerenciar Compras
              </a>
            </li>
            <li>
              <a href="/dashboard/pedidos" className="text-primary hover:underline">
                Gerenciar Pedidos
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
