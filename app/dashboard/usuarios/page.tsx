"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface Usuario {
  id: number
  username: string
  nome: string
  email: string
  cpf: string
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // useEffect(() => {
  //   fetchUsuarios()
  // }, [])

  // useEffect(() => {
  //   if (searchTerm) {
  //     const filtered = usuarios.filter(
  //       (usuario) =>
  //         usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         fixEncoding(usuario.nome).toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         usuario.cpf.includes(searchTerm),
  //     )
  //     setFilteredUsuarios(filtered)
  //   } else {
  //     setFilteredUsuarios(usuarios)
  //   }
  // }, [searchTerm, usuarios])

  // const fetchUsuarios = async () => {
  //   try {
  //     const data = await getUsuarios()
  //     setUsuarios(data)
  //     setFilteredUsuarios(data)
  //   } catch (error) {
  //     console.error("Error fetching usuarios:", error)
  //     toast({
  //       title: "Erro",
  //       description: "Não foi possível carregar os usuários",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Usuários</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Esta seção está em desenvolvimento. Aqui você poderá gerenciar todos os usuários do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <p className="text-lg font-medium">Área em desenvolvimento</p>
            <p className="text-sm text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
