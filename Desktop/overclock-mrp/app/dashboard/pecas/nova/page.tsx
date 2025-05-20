"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { createPeca, getFornecedores, fixEncoding } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface PecaFormData {
  nome_do_produto: string
  descricao_do_produto: string
  categoria_do_produto: string
  marca_do_produto: string
  quantidade_estoque: number
  preco_custo: number
  preco_venda: number
  fornecedor: {
    id_fornecedor: number
  } | null
}

interface Fornecedor {
  id_fornecedor: number
  nome_fornecedor: string
}

export default function NovaPecaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<PecaFormData>({
    nome_do_produto: "",
    descricao_do_produto: "",
    categoria_do_produto: "",
    marca_do_produto: "",
    quantidade_estoque: 0,
    preco_custo: 0,
    preco_venda: 0,
    fornecedor: null,
  })
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const data = await getFornecedores()
        setFornecedores(data)
      } catch (error) {
        console.error("Error fetching fornecedores:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFornecedores()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleSelectChange = (field: string, value: string) => {
    if (field === "fornecedor") {
      if (value === "none") {
        setFormData((prev) => ({ ...prev, fornecedor: null }))
      } else {
        setFormData((prev) => ({
          ...prev,
          fornecedor: { id_fornecedor: Number.parseInt(value) },
        }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await createPeca(formData)
      toast({
        title: "Sucesso",
        description: "Peça criada com sucesso",
      })
      router.push("/dashboard/pecas")
    } catch (error) {
      console.error("Error creating peca:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar a peça",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/pecas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Nova Peça</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informações da Peça</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome_do_produto">Nome</Label>
              <Input
                id="nome_do_produto"
                name="nome_do_produto"
                value={formData.nome_do_produto}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao_do_produto">Descrição</Label>
              <Textarea
                id="descricao_do_produto"
                name="descricao_do_produto"
                value={formData.descricao_do_produto}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="categoria_do_produto">Categoria</Label>
                <Input
                  id="categoria_do_produto"
                  name="categoria_do_produto"
                  value={formData.categoria_do_produto}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marca_do_produto">Marca</Label>
                <Input
                  id="marca_do_produto"
                  name="marca_do_produto"
                  value={formData.marca_do_produto}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="preco_custo">Preço de Custo (R$)</Label>
                <Input
                  id="preco_custo"
                  name="preco_custo"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco_custo}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preco_venda">Preço de Venda (R$)</Label>
                <Input
                  id="preco_venda"
                  name="preco_venda"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco_venda}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantidade_estoque">Quantidade em Estoque</Label>
                <Input
                  id="quantidade_estoque"
                  name="quantidade_estoque"
                  type="number"
                  min="0"
                  value={formData.quantidade_estoque}
                  onChange={handleNumberChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Select
                value={formData.fornecedor ? String(formData.fornecedor.id_fornecedor) : "none"}
                onValueChange={(value) => handleSelectChange("fornecedor", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {fornecedores.map((fornecedor) => (
                    <SelectItem key={fornecedor.id_fornecedor} value={String(fornecedor.id_fornecedor)}>
                      {fixEncoding(fornecedor.nome_fornecedor)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/pecas">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Peça
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
