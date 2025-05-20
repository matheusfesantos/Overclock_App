"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { createPeca } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface PecaFormData {
  nome: string
  descricao: string
  preco: number
  quantidade: number
  categoria: string
}

export default function NovaPecaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<PecaFormData>({
    nome: "",
    descricao: "",
    preco: 0,
    quantidade: 0,
    categoria: "",
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoria: value }))
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
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} rows={3} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={formData.categoria} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Eletrônica">Eletrônica</SelectItem>
                    <SelectItem value="Mecânica">Mecânica</SelectItem>
                    <SelectItem value="Elétrica">Elétrica</SelectItem>
                    <SelectItem value="Hidráulica">Hidráulica</SelectItem>
                    <SelectItem value="Estrutural">Estrutural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  id="preco"
                  name="preco"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  name="quantidade"
                  type="number"
                  min="0"
                  value={formData.quantidade}
                  onChange={handleNumberChange}
                  required
                />
              </div>
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
