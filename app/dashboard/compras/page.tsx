"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Trash2, Pencil } from "lucide-react"
import {
  getCompras,
  createCompra,
  updateCompra,
  deleteCompra,
  getPecas,
  getFornecedores,
  fixEncoding,
} from "@/lib/api-service"
import { useUserInfo } from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"

// Interface baseada no JSON fornecido
interface Compra {
  id_compra: number
  data_compra: string
  observacao: string
  pecas: {
    id_peca: number
    nome_do_produto: string
    descricao_do_produto: string
    categoria_do_produto: string
    marca_do_produto: string
    quantidade_estoque: number
    preco_custo: number
    preco_venda: number
    fornecedor: {
      id_fornecedor: number
      nome_fornecedor: string
      cpnj_fornecedor: string
      telefone_fornecedor: string
      email_fornecedor: string
    }
  }
  usuarios: {
    id_usuario: number
    nome: string
    email: string
    username: string
  }
  fornecedor: {
    id_fornecedor: number
    nome_fornecedor: string
    cpnj_fornecedor: string
    telefone_fornecedor: string
    email_fornecedor: string
  }
}

interface Peca {
  id_peca: number
  nome_do_produto: string
}

interface Fornecedor {
  id_fornecedor: number
  nome_fornecedor: string
}

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([])
  const [filteredCompras, setFilteredCompras] = useState<Compra[]>([])
  const [pecas, setPecas] = useState<Peca[]>([])
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentCompra, setCurrentCompra] = useState<Compra | null>(null)

  const [formData, setFormData] = useState({
    observacao: "",
    id_peça: "",
    id_fornecedor: "",
  })

  const [editObservacao, setEditObservacao] = useState("")

  const { userInfo } = useUserInfo()
  const { toast } = useToast()

  // Carregar dados
  useEffect(() => {
    fetchData()
  }, [])

  // Filtrar compras quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm) {
      const filtered = compras.filter(
        (compra) =>
          compra.observacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fixEncoding(compra.pecas.nome_do_produto).toLowerCase().includes(searchTerm.toLowerCase()) ||
          fixEncoding(compra.fornecedor.nome_fornecedor).toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCompras(filtered)
    } else {
      setFilteredCompras(compras)
    }
  }, [searchTerm, compras])

  // Buscar todos os dados necessários
  const fetchData = async () => {
    try {
      setLoading(true)
      const [comprasData, pecasData, fornecedoresData] = await Promise.all([
        getCompras(),
        getPecas(),
        getFornecedores(),
      ])

      setCompras(comprasData)
      setFilteredCompras(comprasData)
      setPecas(pecasData)
      setFornecedores(fornecedoresData)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  // Criar nova compra
  const handleCreate = async () => {
    try {
      if (!formData.id_peça || !formData.id_fornecedor || !formData.observacao) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        })
        return
      }

      const data = {
        ...formData,
        id_usuario: userInfo?.id.toString() || "1",
      }

      await createCompra(data)
      await fetchData()

      setFormData({
        observacao: "",
        id_peça: "",
        id_fornecedor: "",
      })

      setIsDialogOpen(false)

      toast({
        title: "Sucesso",
        description: "Compra registrada com sucesso",
      })
    } catch (error) {
      console.error("Erro ao criar compra:", error)
      toast({
        title: "Erro",
        description: "Não foi possível registrar a compra",
        variant: "destructive",
      })
    }
  }

  // Atualizar compra
  const handleUpdate = async () => {
    try {
      if (!currentCompra || !editObservacao) {
        toast({
          title: "Erro",
          description: "Preencha a observação",
          variant: "destructive",
        })
        return
      }

      await updateCompra(currentCompra.id_compra, { observacao: editObservacao })
      await fetchData()

      setCurrentCompra(null)
      setEditObservacao("")
      setIsEditDialogOpen(false)

      toast({
        title: "Sucesso",
        description: "Compra atualizada com sucesso",
      })
    } catch (error) {
      console.error("Erro ao atualizar compra:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a compra",
        variant: "destructive",
      })
    }
  }

  // Excluir compra
  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await deleteCompra(id)
      setCompras((prev) => prev.filter((compra) => compra.id_compra !== id))
      toast({
        title: "Sucesso",
        description: "Compra excluída com sucesso",
      })
    } catch (error) {
      console.error("Erro ao excluir compra:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a compra",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  // Abrir diálogo de edição
  const openEditDialog = (compra: Compra) => {
    setCurrentCompra(compra)
    setEditObservacao(compra.observacao)
    setIsEditDialogOpen(true)
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compras</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Compra
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nova Compra</DialogTitle>
              <DialogDescription>Preencha os dados abaixo para registrar uma nova compra.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="peca">Peça</Label>
                <Select
                  value={formData.id_peça}
                  onValueChange={(value) => setFormData({ ...formData, id_peça: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma peça" />
                  </SelectTrigger>
                  <SelectContent>
                    {pecas.map((peca) => (
                      <SelectItem key={peca.id_peca} value={peca.id_peca.toString()}>
                        {fixEncoding(peca.nome_do_produto)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Select
                  value={formData.id_fornecedor}
                  onValueChange={(value) => setFormData({ ...formData, id_fornecedor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {fornecedores.map((fornecedor) => (
                      <SelectItem key={fornecedor.id_fornecedor} value={fornecedor.id_fornecedor.toString()}>
                        {fixEncoding(fornecedor.nome_fornecedor)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacao">Observação</Label>
                <Textarea
                  id="observacao"
                  placeholder="Descreva o motivo da compra"
                  value={formData.observacao}
                  onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Registrar Compra</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Compras</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Barra de busca */}
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar compras..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Estado de carregamento */}
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
          ) : filteredCompras.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <p className="text-lg font-medium">Nenhuma compra encontrada</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Tente ajustar sua busca" : "Não há compras registradas no sistema"}
              </p>
            </div>
          ) : (
            /* Tabela de compras */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Peça</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Observação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompras.map((compra) => (
                    <TableRow key={compra.id_compra}>
                      <TableCell>{formatDate(compra.data_compra)}</TableCell>
                      <TableCell>{fixEncoding(compra.pecas.nome_do_produto)}</TableCell>
                      <TableCell>{fixEncoding(compra.fornecedor.nome_fornecedor)}</TableCell>
                      <TableCell>{fixEncoding(compra.usuarios.nome)}</TableCell>
                      <TableCell>{fixEncoding(compra.observacao)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => openEditDialog(compra)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Excluir</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir esta compra? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(compra.id_compra)}
                                  disabled={deletingId === compra.id_compra}
                                >
                                  {deletingId === compra.id_compra ? "Excluindo..." : "Excluir"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Compra</DialogTitle>
            <DialogDescription>Atualize a observação da compra.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-observacao">Observação</Label>
              <Textarea
                id="edit-observacao"
                placeholder="Descreva o motivo da compra"
                value={editObservacao}
                onChange={(e) => setEditObservacao(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}