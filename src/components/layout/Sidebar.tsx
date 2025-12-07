import { Bot, Package, MessageSquare, Settings, LayoutDashboard, CreditCard, Users, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Package, label: "Produtos", path: "/products" },
  { icon: MessageSquare, label: "Mensagens", path: "/messages" },
  { icon: Users, label: "Clientes", path: "/customers" },
  { icon: CreditCard, label: "Pagamentos", path: "/payments" },
  { icon: Bell, label: "Notificações", path: "/notifications" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow-effect">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">SalesBot</h1>
            <p className="text-xs text-muted-foreground">Painel de Controle</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bot Status */}
        <div className="border-t border-border p-4">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-3 w-3 rounded-full bg-success" />
                <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-success opacity-75" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Bot Online</p>
                <p className="text-xs text-muted-foreground">Funcionando normalmente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
