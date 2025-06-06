"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Trash2, Pencil } from "lucide-react";
import {
  getCompras,
  createCompra,
  updateCompra,
  deleteCompra,
  getPecas,
  getFornecedores,
  fixEncoding,
} from "@/lib/api-service";
import { useUserInfo } from "@/lib/auth-service";
import { useToast } from "@/hooks/use-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Interfaces baseadas nos dados da API
interface Compra {
  id_compra: number;
  data_compra: string;
  observacao: string;
  quantidade: number;
  pecas: {
    id_peca: number;
    nome_do_produto: string;
    descricao_do_produto: string;
    categoria_do_produto: string;
    marca_do_produto: string;
    quantidade_estoque: number;
    preco_custo: number;
    preco_venda: number;
    fornecedor: {
      id_fornecedor: number;
      nome_fornecedor: string;
      cpnj_fornecedor: string;
      telefone_fornecedor: string;
      email_fornecedor: string;
    };
  };
  usuarios: {
    id_usuario: number;
    nome: string;
    email: string;
    username: string;
  };
}

interface Peca {
  id_peca: number;
  nome_do_produto: string;
}

interface Fornecedor {
  id_fornecedor: number;
  nome_fornecedor: string;
}

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [filteredCompras, setFilteredCompras] = useState<Compra[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCompra, setCurrentCompra] = useState<Compra | null>(null);

  const [formData, setFormData] = useState({
    observacao: "",
    id_peca: "",
    id_fornecedor: "",
    quantidade: 0,
  });

  const [editObservacao, setEditObservacao] = useState("");

  const { userInfo } = useUserInfo();
  const { toast } = useToast();

  // Carregar dados na inicialização
  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar compras quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm) {
      const filtered = compras.filter(
        (compra) =>
          compra.observacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fixEncoding(compra.pecas.nome_do_produto)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          fixEncoding(compra.pecas.fornecedor.nome_fornecedor)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredCompras(filtered);
    } else {
      setFilteredCompras(compras);
    }
  }, [searchTerm, compras]);

  // Buscar dados da API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [comprasData, pecasData, fornecedoresData] = await Promise.all([
        getCompras(),
        getPecas(),
        getFornecedores(),
      ]);
      setCompras(comprasData);
      setFilteredCompras(comprasData);
      setPecas(pecasData);
      setFornecedores(fornecedoresData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Criar nova compra
  const handleCreate = async () => {
    try {
      if (!formData.id_peca || !formData.id_fornecedor) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        });
        return;
      }
      const data = {
        id_peca: Number(formData.id_peca),
        id_fornecedor: Number(formData.id_fornecedor),
        quantidade: Number(formData.quantidade),
        observacao: formData.observacao,
      };

      await createCompra(data);
      await fetchData();

      setFormData({
        observacao: "",
        id_peca: "",
        id_fornecedor: "",
        quantidade: 0,
      });
      setIsDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Compra registrada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao criar compra:", error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar a compra",
        variant: "destructive",
      });
    }
  };

  // Excluir compra
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteCompra(id);
      setCompras((prev) => prev.filter((compra) => compra.id_compra !== id));
      toast({
        title: "Sucesso",
        description: "Compra excluída com sucesso",
      });
    } catch (error) {
      console.error("Erro ao excluir compra:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a compra",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Abrir diálogo de edição
  const openEditDialog = (compra: Compra) => {
    setCurrentCompra(compra);
    setEditObservacao(compra.observacao);
    setIsEditDialogOpen(true);
  };

  // Formatar data para pt-BR
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <ToastContainer />
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
              <DialogDescription>
                Preencha os dados abaixo para registrar uma nova compra.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="peca">Peça</Label>
                <Select
                  value={formData.id_peca}
                  onValueChange={(value) =>
                    setFormData({ ...formData, id_peca: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma peça" />
                  </SelectTrigger>
                  <SelectContent>
                    {pecas.map((peca) => (
                      <SelectItem
                        key={peca.id_peca}
                        value={String(peca.id_peca)}
                      >
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
                  onValueChange={(value) =>
                    setFormData({ ...formData, id_fornecedor: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um fornecedor" />
                  </SelectTrigger>
                  {fornecedores && fornecedores.length > 0 && (
                    <SelectContent>
                      {fornecedores.map((forn) => (
                        <SelectItem
                          key={forn.id_fornecedor}
                          value={String(forn.id_fornecedor)}
                        >
                          {fixEncoding(forn.nome_fornecedor)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.quantidade}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantidade: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacao">Observação</Label>
                <textarea
                  id="observacao"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={formData.observacao}
                  onChange={(e) =>
                    setFormData({ ...formData, observacao: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="Buscar compras..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Compras</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Peça</TableHead>
                <TableHead>Observação</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredCompras.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Nenhuma compra encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompras.map((compra) => (
                  <TableRow key={compra.id_compra}>
                    <TableCell>{formatDate(compra.data_compra)}</TableCell>
                    <TableCell>
                      {fixEncoding(compra.pecas.nome_do_produto)}
                    </TableCell>
                    <TableCell>{fixEncoding(compra.observacao)}</TableCell>
                    <TableCell>{compra.quantidade}</TableCell>
                    <TableCell>
                      {fixEncoding(compra.pecas.fornecedor.nome_fornecedor)}
                    </TableCell>
                    <TableCell>{fixEncoding(compra.usuarios.nome)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(compra)}
                          aria-label={`Editar compra ${compra.id_compra}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              aria-label={`Excluir compra ${compra.id_compra}`}
                              disabled={deletingId === compra.id_compra}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmar exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta compra? Esta
                                ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(compra.id_compra)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
