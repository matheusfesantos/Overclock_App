"use client"

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
import { Plus, Trash2, Pencil, Search } from "lucide-react";

import {
  getPedidos,
  createPedido,
  updatePedido,
  deletePedido,
  getPecas,
  getFornecedores,
  fixEncoding,
} from "@/lib/api-service";

import { useToast } from "@/hooks/use-toast";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pecas, setPecas] = useState<any[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPedido, setEditingPedido] = useState<any | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState<any | null>(null);

  // Form state
  const [form, setForm] = useState({
    id_peca: "",
    id_fornecedor: "",
    quantidade: 1,
    observacao: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
    fetchPecas();
    fetchFornecedores();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const data = await getPedidos();
      setPedidos(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao carregar pedidos." });
    } finally {
      setLoading(false);
    }
  }

  async function fetchPecas() {
    try {
      const data = await getPecas();
      setPecas(data);
    } catch {
      toast({ variant: "destructive", title: "Erro ao carregar peças." });
    }
  }

  async function fetchFornecedores() {
    try {
      const data = await getFornecedores();
      setFornecedores(data);
    } catch {
      toast({ variant: "destructive", title: "Erro ao carregar fornecedores." });
    }
  }

  function openNewPedido() {
    setEditingPedido(null);
    setForm({ id_peca: "", id_fornecedor: "", quantidade: 1, observacao: "" });
    setOpenDialog(true);
  }

  function openEditPedido(pedido: any) {
    setEditingPedido(pedido);
    setForm({
      id_peca: pedido.idPeca || "",
      id_fornecedor: pedido.idFornecedor || "",
      quantidade: pedido.quantidade || 1,
      observacao: pedido.observacao || "",
    });
    setOpenDialog(true);
  }

  function closeDialog() {
    setOpenDialog(false);
    setEditingPedido(null);
  }

  async function handleSave() {
    try {
      if (editingPedido) {
        // Update
        await updatePedido(editingPedido.id_pedido, {
          id_peca: Number(form.id_peca),
          id_fornecedor: Number(form.id_fornecedor),
          quantidade: Number(form.quantidade),
          observacao: form.observacao,
        });
        toast({ title: "Pedido atualizado com sucesso!" });
      } else {
        // Create
        await createPedido({
          id_peca: Number(form.id_peca),
          id_fornecedor: Number(form.id_fornecedor),
          quantidade: Number(form.quantidade),
          observacao: form.observacao,
        });
        toast({ title: "Pedido criado com sucesso!" });
      }
      closeDialog();
      fetchData();
    } catch (error: any) {
      toast({ variant: "destructive", title: error.message || "Erro ao salvar pedido" });
    }
  }

  // Delete
  function openDelete(pedido: any) {
    setPedidoToDelete(pedido);
    setOpenDeleteDialog(true);
  }

  function closeDelete() {
    setPedidoToDelete(null);
    setOpenDeleteDialog(false);
  }

  async function handleDelete() {
    if (!pedidoToDelete) return;
    try {
      await deletePedido(pedidoToDelete.id_pedido);
      toast({ title: "Pedido excluído com sucesso!" });
      closeDelete();
      fetchData();
    } catch (error: any) {
      toast({ variant: "destructive", title: error.message || "Erro ao excluir pedido" });
    }
  }

  // Filtragem simples por usuário ou observação
  const filteredPedidos = pedidos.filter((p) => {
    const search = searchTerm.toLowerCase();
    return (
      p.usuarios?.nome.toLowerCase().includes(search) ||
      p.observacao.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <Button onClick={openNewPedido}>
          <Plus size={16} className="mr-2" />
          Novo Pedido
        </Button>
      </div>

      <div className="flex items-center max-w-sm border rounded px-3 py-2">
        <Search className="mr-2 text-gray-500" />
        <input
          placeholder="Buscar por usuário ou observação"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="outline-none bg-transparent w-full"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Peça</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead>Data Pedido</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPedidos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Nenhum pedido encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPedidos.map((pedido) => (
                    <TableRow key={pedido.id_pedido}>
                      <TableCell>{pedido.id_pedido}</TableCell>
                      <TableCell>{pedido.usuarios?.nome}</TableCell>
                      <TableCell>{pedido.idPeca}</TableCell>
                      <TableCell>{pedido.idFornecedor}</TableCell>
                      <TableCell>{pedido.quantidade}</TableCell>
                      <TableCell>{pedido.observacao}</TableCell>
                      <TableCell>
                        {new Date(pedido.data_pedido).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditPedido(pedido)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDelete(pedido)}
                          className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Criar / Editar Pedido */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPedido ? "Editar Pedido" : "Novo Pedido"}
            </DialogTitle>
            <DialogDescription>
              {editingPedido
                ? `Editando pedido #${editingPedido.id_pedido}`
                : "Preencha os dados para criar um novo pedido."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="peca">Peça</Label>
              <Select
                value={form.id_peca}
                onValueChange={(val) => setForm({ ...form, id_peca: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a peça" />
                </SelectTrigger>
                <SelectContent>
                  {pecas.map((peca) => (
                    <SelectItem key={peca.id_peca} value={String(peca.id_peca)}>
                      {fixEncoding(peca.nome_peca)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Select
                value={form.id_fornecedor}
                onValueChange={(val) =>
                  setForm({ ...form, id_fornecedor: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
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
              </Select>
            </div>

            <div>
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                type="number"
                id="quantidade"
                min={1}
                value={form.quantidade}
                onChange={(e) =>
                  setForm({ ...form, quantidade: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <Label htmlFor="observacao">Observação</Label>
              <Input
                type="text"
                id="observacao"
                value={form.observacao}
                onChange={(e) =>
                  setForm({ ...form, observacao: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingPedido ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação para excluir */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o pedido #
              {pedidoToDelete?.id_pedido}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDelete}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
