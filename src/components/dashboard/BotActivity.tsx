import { ShoppingCart, CreditCard, Package, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/hooks/useOrders";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BotActivityProps {
  orders: Order[];
}

const typeConfig = {
  pending: { icon: ShoppingCart, color: "text-primary", bg: "bg-primary/10", label: "Novo pedido" },
  awaiting_payment: { icon: CreditCard, color: "text-warning", bg: "bg-warning/10", label: "PIX gerado" },
  paid: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Pagamento confirmado" },
  delivered: { icon: Package, color: "text-accent", bg: "bg-accent/10", label: "Produto entregue" },
};

export function BotActivity({ orders }: BotActivityProps) {
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground">Atividade do Bot</h3>
      <p className="text-sm text-muted-foreground">Eventos em tempo real</p>

      <div className="mt-6 space-y-3">
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhuma atividade</p>
        ) : (
          recentOrders.map((order, index) => {
            const config = typeConfig[order.status as keyof typeof typeConfig] || typeConfig.pending;
            const Icon = config.icon;

            return (
              <div
                key={order.id}
                className="flex items-start gap-3 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn("mt-0.5 rounded-lg p-2", config.bg)}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{config.label}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{order.discord_username}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: ptBR })}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
