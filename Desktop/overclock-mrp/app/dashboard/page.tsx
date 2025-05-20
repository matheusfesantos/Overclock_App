"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { getPecas, getFornecedores, fixEncoding } from "@/lib/api-service"

interface Peca {
  id_peca: number
  nome_do_produto: string
  categoria_do_produto: string
  quantidade_estoque: number
}

interface Fornecedor {
  id_fornecedor: number
  nome_fornecedor: string
}

export default function DashboardPage() {
  // Estado
  const [pecas, setPecas] = useState<Peca[]>([])
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [loading, setLoading] = useState(true)
  const [categorias, setCategorias] = useState<Record<string, number>>({})

  // Carregar dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pecasData, fornecedoresData] = await Promise.all([getPecas(), getFornecedores()])

        setPecas(pecasData)
        setFornecedores(fornecedoresData)

        // Processar categorias para o gráfico
        const categoriasCount: Record<string, number> = {}
        pecasData.forEach((peca) => {
          const categoria = fixEncoding(peca.categoria_do_produto)
          categoriasCount[categoria] = (categoriasCount[categoria] || 0) + 1
        })

        setCategorias(categoriasCount)
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Indicador de carregamento
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Calcular itens com estoque baixo (menos de 10 unidades)
  const lowStockItems = pecas.filter((peca) => peca.quantidade_estoque < 10).length

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Cards de resumo */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Peças</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pecas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Fornecedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fornecedores.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Peças em Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categorias de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(categorias).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Abas de gráficos */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        {/* Aba de visão geral */}
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

        {/* Aba de análises */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Fornecedores</CardTitle>
                <CardDescription>Distribuição de peças por fornecedor</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Peças</CardTitle>
                <CardDescription>Peças com maior quantidade em estoque</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pecas
                    .sort((a, b) => b.quantidade_estoque - a.quantidade_estoque)
                    .slice(0, 5)
                    .map((peca) => (
                      <div key={peca.id_peca} className="flex items-center justify-between">
                        <div className="font-medium">{fixEncoding(peca.nome_do_produto)}</div>
                        <div className="text-sm text-gray-500">{peca.quantidade_estoque} unidades</div>
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
