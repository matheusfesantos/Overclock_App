"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { getFornecedores, deleteFornecedor, fixEncoding } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface Fornecedor {
  id_fornecedor: number
  nome_fornecedor: string
  cpnj_fornecedor: string
  telefone_fornecedor: string
  email_fornecedor: string
}

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [filteredFornecedores, setFilteredFornecedores] = useState<Fornecedor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchFornecedores()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = fornecedores.filter(
        (fornecedor) =>
          fixEncoding(fornecedor.nome_fornecedor).toLowerCase().includes(searchTerm.toLowerCase()) ||
          fornecedor.cpnj_fornecedor.includes(searchTerm) ||
          fornecedor.email_fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fornecedor.telefone_fornecedor.includes(searchTerm),
      )
      setFilteredFornecedores(filtered)
    } else {
      setFilteredFornecedores(fornecedores)
    }
  }, [searchTerm, fornecedores])

  const fetchFornecedores = async () => {
    try {
      const data = await getFornecedores()
      setFornecedores(data)
      setFilteredFornecedores(data)
    } catch (error) {
      console.error("Error fetching fornecedores:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os fornecedores",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await deleteFornecedor(id)
      setFornecedores((prev) => prev.filter((fornecedor) => fornecedor.id_fornecedor !== id))
      toast({
        title: "Sucesso",
        description: "Fornecedor deletado com sucesso",
      })
    } catch (error) {
      console.error("Error deleting fornecedor:", error)
      toast({
        title: "Erro",
        description: "Não foi possível deletar o fornecedor",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fornecedores</h1>
        <Link href="/dashboard/fornecedores/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Fornecedor
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar fornecedores..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
          ) : filteredFornecedores.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <p className="text-lg font-medium">Nenhum fornecedor encontrado</p>
              <p className="text-sm text-gray-500">
                {searchTerm ? "Tente ajustar sua busca" : "Clique em 'Novo Fornecedor' para adicionar"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFornecedores.map((fornecedor) => (
                    <TableRow key={fornecedor.id_fornecedor}>
                      <TableCell className="font-medium">{fixEncoding(fornecedor.nome_fornecedor)}</TableCell>
                      <TableCell>{fornecedor.cpnj_fornecedor}</TableCell>
                      <TableCell>{fornecedor.email_fornecedor}</TableCell>
                      <TableCell>{fornecedor.telefone_fornecedor}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/fornecedores/${fornecedor.id_fornecedor}`}>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                          </Link>
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
                                  Tem certeza que deseja excluir o fornecedor "{fixEncoding(fornecedor.nome_fornecedor)}
                                  "? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(fornecedor.id_fornecedor)}
                                  disabled={deletingId === fornecedor.id_fornecedor}
                                >
                                  {deletingId === fornecedor.id_fornecedor ? "Excluindo..." : "Excluir"}
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
    </div>
  )
}
