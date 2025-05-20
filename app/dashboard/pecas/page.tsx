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
import { Search, Trash2 } from "lucide-react"
import { getPecas, deletePeca, fixEncoding } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface Peca {
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
  } | null
}

export default function PecasPage() {
  // Estado
  const [pecas, setPecas] = useState<Peca[]>([])
  const [filteredPecas, setFilteredPecas] = useState<Peca[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { toast } = useToast()

  // Carregar dados
  useEffect(() => {
    fetchPecas()
  }, [])

  // Filtrar peças quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm) {
      const filtered = pecas.filter(
        (peca) =>
          fixEncoding(peca.nome_do_produto).toLowerCase().includes(searchTerm.toLowerCase()) ||
          fixEncoding(peca.descricao_do_produto).toLowerCase().includes(searchTerm.toLowerCase()) ||
          fixEncoding(peca.categoria_do_produto).toLowerCase().includes(searchTerm.toLowerCase()) ||
          fixEncoding(peca.marca_do_produto).toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPecas(filtered)
    } else {
      setFilteredPecas(pecas)
    }
  }, [searchTerm, pecas])

  // Buscar peças da API
  const fetchPecas = async () => {
    try {
      const data = await getPecas()
      setPecas(data)
      setFilteredPecas(data)
    } catch (error) {
      console.error("Erro ao buscar peças:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as peças",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Excluir peça
  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await deletePeca(id)
      setPecas((prev) => prev.filter((peca) => peca.id_peca !== id))
      toast({
        title: "Sucesso",
        description: "Peça deletada com sucesso",
      })
    } catch (error) {
      console.error("Erro ao deletar peça:", error)
      toast({
        title: "Erro",
        description: "Não foi possível deletar a peça",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Peças</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visualizar Peças</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Barra de busca */}
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar peças..."
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
          ) : filteredPecas.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <p className="text-lg font-medium">Nenhuma peça encontrada</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Tente ajustar sua busca" : "Não há peças cadastradas no sistema"}
              </p>
            </div>
          ) : (
            /* Tabela de peças */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Preço Custo</TableHead>
                    <TableHead className="text-right">Preço Venda</TableHead>
                    <TableHead className="text-right">Estoque</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPecas.map((peca) => (
                    <TableRow key={peca.id_peca}>
                      <TableCell className="font-medium">{fixEncoding(peca.nome_do_produto)}</TableCell>
                      <TableCell>{fixEncoding(peca.marca_do_produto)}</TableCell>
                      <TableCell>{fixEncoding(peca.categoria_do_produto)}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(peca.preco_custo)}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(peca.preco_venda)}
                      </TableCell>
                      <TableCell className="text-right">{peca.quantidade_estoque}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
                                  Tem certeza que deseja excluir a peça "{fixEncoding(peca.nome_do_produto)}"? Esta ação
                                  não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(peca.id_peca)}
                                  disabled={deletingId === peca.id_peca}
                                >
                                  {deletingId === peca.id_peca ? "Excluindo..." : "Excluir"}
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
