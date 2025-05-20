"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { getStats } from "@/lib/api-service"

interface Stats {
  totalPecas: number
  totalFornecedores: number
  pecasPorCategoria: Record<string, number>
  fornecedoresPorEstado: Record<string, number>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalPecas: 0,
    totalFornecedores: 0,
    pecasPorCategoria: {},
    fornecedoresPorEstado: {},
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real implementation, this would fetch actual stats from the API
        // For now, we'll use mock data
        const data = await getStats()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Peças</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPecas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Fornecedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFornecedores}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Peças em Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Movimentação de Estoque</CardTitle>
                <CardDescription>Entradas e saídas de peças nos últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <LineChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Peças por Categoria</CardTitle>
                <CardDescription>Distribuição de peças por categoria</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Fornecedores por Estado</CardTitle>
                <CardDescription>Distribuição geográfica dos fornecedores</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Fornecedores</CardTitle>
                <CardDescription>Fornecedores com mais peças cadastradas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Fornecedor A", count: 42 },
                    { name: "Fornecedor B", count: 38 },
                    { name: "Fornecedor C", count: 27 },
                    { name: "Fornecedor D", count: 21 },
                    { name: "Fornecedor E", count: 15 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.count} peças</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
