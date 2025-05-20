"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { getFornecedorById, updateFornecedor } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface FornecedorFormData {
  nome_fornecedor: string
  cpnj_fornecedor: string
  telefone_fornecedor: string
  email_fornecedor: string
}

export default function EditarFornecedorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<FornecedorFormData>({
    nome_fornecedor: "",
    cpnj_fornecedor: "",
    telefone_fornecedor: "",
    email_fornecedor: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchFornecedor = async () => {
      try {
        const data = await getFornecedorById(Number.parseInt(params.id))
        setFormData(data)
      } catch (error) {
        console.error("Error fetching fornecedor:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do fornecedor",
          variant: "destructive",
        })
        router.push("/dashboard/fornecedores")
      } finally {
        setLoading(false)
      }
    }

    fetchFornecedor()
  }, [params.id, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateFornecedor(Number.parseInt(params.id), formData)
      toast({
        title: "Sucesso",
        description: "Fornecedor atualizado com sucesso",
      })
      router.push("/dashboard/fornecedores")
    } catch (error) {
      console.error("Error updating fornecedor:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o fornecedor",
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
        <Link href="/dashboard/fornecedores">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Editar Fornecedor</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informações do Fornecedor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome_fornecedor">Nome</Label>
              <Input
                id="nome_fornecedor"
                name="nome_fornecedor"
                value={formData.nome_fornecedor}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cpnj_fornecedor">CNPJ</Label>
                <Input
                  id="cpnj_fornecedor"
                  name="cpnj_fornecedor"
                  value={formData.cpnj_fornecedor}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone_fornecedor">Telefone</Label>
                <Input
                  id="telefone_fornecedor"
                  name="telefone_fornecedor"
                  value={formData.telefone_fornecedor}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_fornecedor">Email</Label>
              <Input
                id="email_fornecedor"
                name="email_fornecedor"
                type="email"
                value={formData.email_fornecedor}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/fornecedores">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
