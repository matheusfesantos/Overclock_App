"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Settings,
  Menu,
  LogOut,
  ShoppingCart,
  ShoppingBag,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { logout } from "@/lib/auth-service"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Peças",
      icon: Package,
      href: "/dashboard/pecas",
      active: pathname.includes("/dashboard/pecas"),
    },
    {
      label: "Fornecedores",
      icon: Truck,
      href: "/dashboard/fornecedores",
      active: pathname.includes("/dashboard/fornecedores"),
    },
    {
      label: "Compras",
      icon: ShoppingCart,
      href: "/dashboard/compras",
      active: pathname.includes("/dashboard/compras"),
    },
    {
      label: "Pedidos",
      icon: ShoppingBag,
      href: "/dashboard/pedidos",
      active: pathname.includes("/dashboard/pedidos"),
    },
    /*
    {
      label: "Usuários",
      icon: Users,
      href: "/dashboard/usuarios",
      active: pathname.includes("/dashboard/usuarios"),
    },
    */
    {
      label: "Meu Perfil",
      icon: User,
      href: "/dashboard/perfil",
      active: pathname.includes("/dashboard/perfil"),
    },
  ]

  const handleLogout = async () => {
    await logout()
    window.location.href = "/login"
  }

  const SidebarContent = (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="border-b px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6DB33F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          <span className="text-xl font-bold">Overclock MRP</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="flex flex-col gap-2">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} onClick={() => setOpen(false)}>
              <Button variant={route.active ? "default" : "ghost"} className={cn("w-full justify-start")}>
                <route.icon className="mr-2 h-5 w-5" />
                {route.label}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="ml-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          {SidebarContent}
        </SheetContent>
      </Sheet>
    )
  }

  return <div className="hidden w-64 border-r md:block">{SidebarContent}</div>
}
