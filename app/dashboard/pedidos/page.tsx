"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PedidosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pedidos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Pedidos</CardTitle>
          <CardDescription>
            Esta seção será implementada pelo usuário. Aqui você poderá gerenciar todos os pedidos do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <p className="text-lg font-medium">Área em desenvolvimento</p>
            <p className="text-sm text-muted-foreground">
              Esta funcionalidade será implementada em breve pelo usuário.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
