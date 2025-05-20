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
import { getFornecedorById, updateFornecedor } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface FornecedorFormData {
  nome: string
  cnpj: string
  email: string
  telefone: string
  endereco: string
  cidade: string
  estado: string
}

export default function EditarFornecedorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<FornecedorFormData>({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, estado: value }))
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
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Textarea
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                rows={2}
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={formData.estado} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC">Acre</SelectItem>
                    <SelectItem value="AL">Alagoas</SelectItem>
                    <SelectItem value="AP">Amapá</SelectItem>
                    <SelectItem value="AM">Amazonas</SelectItem>
                    <SelectItem value="BA">Bahia</SelectItem>
                    <SelectItem value="CE">Ceará</SelectItem>
                    <SelectItem value="DF">Distrito Federal</SelectItem>
                    <SelectItem value="ES">Espírito Santo</SelectItem>
                    <SelectItem value="GO">Goiás</SelectItem>
                    <SelectItem value="MA">Maranhão</SelectItem>
                    <SelectItem value="MT">Mato Grosso</SelectItem>
                    <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="PA">Pará</SelectItem>
                    <SelectItem value="PB">Paraíba</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    <SelectItem value="PE">Pernambuco</SelectItem>
                    <SelectItem value="PI">Piauí</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    <SelectItem value="RO">Rondônia</SelectItem>
                    <SelectItem value="RR">Roraima</SelectItem>
                    <SelectItem value="SC">Santa Catarina</SelectItem>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="SE">Sergipe</SelectItem>
                    <SelectItem value="TO">Tocantins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
