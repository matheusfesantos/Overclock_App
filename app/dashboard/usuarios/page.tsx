"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Table } from "lucide-react"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Usuario {
  id: number
  username: string
  nome: string
  email: string
  cpf: string
  tipo: string
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchUsuarios = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/usuarios")
      if (!response.ok) {
        throw new Error("Erro ao buscar usuários")
      }
      const data = await response.json()
      setUsuarios(data)
      setFilteredUsuarios(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  UseEffect(() => {
    fetchUsuarios()
  }, [])


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Usuários</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Aqui você pode visualizar e gerenciar os usuários do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Username</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </Card>
    </div>
  )
}
function UseEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.")
}

