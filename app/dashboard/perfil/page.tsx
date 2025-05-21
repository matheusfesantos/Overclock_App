"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { getUserDetails } from "@/lib/api-service"

export interface Authority {
  authority: string;
}

export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  senha: string;
  username: string;
  tipo: string;
  data_criacao: string; // ISO date string
  cpf: string;
  enabled: boolean;
  password: string;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  authorities: Authority[];
}

export default function PerfilPage() {
  // Dados do usuári
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    username: "",
    email: "",
    cpf: "",
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL

   const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/usuarios/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`, // se usar token
        },
      });

      console.log(localStorage.getItem("token"));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Usuario = await response.json();
      setUserInfo(data);
      setError("");
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Erro ao carregar os dados do usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Meu Perfil</h1>
    </div>

    <div className="grid gap-6 md:grid-cols-3">
      {/* Card de informações do usuário */}
      <Card className="md:col-span-1">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Avatar" />
              <AvatarFallback className="text-2xl">
                {userInfo?.nome
                  ? userInfo.nome
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0]?.toUpperCase())
                    .slice(0, 2)
                    .join("")
                  : "OU"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-bold">{userInfo?.nome || "Usuário"}</h2>
              <p className="text-sm text-muted-foreground">{userInfo?.email || "usuario@email.com"}</p>
            </div>
            <Separator />
            <div className="w-full space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Usuário:</span>
                <span className="text-sm text-muted-foreground">{userInfo?.username || "usuario"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">CPF:</span>
                <span className="text-sm text-muted-foreground">
                  {userInfo?.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") || "000.000.000-00"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de formulários */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="info">Dados Pessoais</TabsTrigger>
              {/*
                <TabsTrigger value="security">Segurança</TabsTrigger>
                */}
            </TabsList>
            {/* Aba de dados pessoais */}
            <TabsContent value="info" className="mt-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mb-4 border-green-500 bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <form>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder={userInfo?.username}
                      value={formData.username}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder= {userInfo?.nome}
                      value={formData.nome}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={userInfo?.email}
                      value={formData.email}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      placeholder={userInfo?.cpf}
                      value={formData.cpf}
                      disabled
                    />
                  </div>
                  {/*
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        placeholder="(00) 00000-0000"
                        value={formData.telefone}
                        onChange={handleChange}
                      />
                    </div>
                    */}
                  {/*
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                    */}
                </div>
              </form>
            </TabsContent>

            {/*
              <TabsContent value="security" className="mt-4">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="mb-4 border-green-500 bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="senhaAtual">Senha Atual</Label>
                      <Input
                        id="senhaAtual"
                        name="senhaAtual"
                        type="password"
                        placeholder="Digite sua senha atual"
                        value={passwordData.senhaAtual}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="novaSenha">Nova Senha</Label>
                      <Input
                        id="novaSenha"
                        name="novaSenha"
                        type="password"
                        placeholder="Digite sua nova senha"
                        value={passwordData.novaSenha}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                      <Input
                        id="confirmarSenha"
                        name="confirmarSenha"
                        type="password"
                        placeholder="Confirme sua nova senha"
                        value={passwordData.confirmarSenha}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Atualizando..." : "Atualizar Senha"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  </div>
)
}
function fetchData() {
  throw new Error("Function not implemented.")
}