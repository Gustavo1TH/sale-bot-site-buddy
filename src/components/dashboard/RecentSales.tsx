import { CheckCircle2, Clock, XCircle, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/hooks/useOrders";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentSalesProps {
  orders: Order[];
}

const statusConfig = {
  paid: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Pago" },
  delivered: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Entregue" },
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pendente" },
  awaiting_payment: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Aguardando" },
  failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Falhou" },
};

export function RecentSales({ orders }: RecentSalesProps) {
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground">Vendas Recentes</h3>
      <p className="text-sm text-muted-foreground">Últimas transações do bot</p>

      <div className="mt-6 space-y-4">
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nenhuma venda ainda</p>
          </div>
        ) : (
          recentOrders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("rounded-lg p-2", status.bg)}>
                    <StatusIcon className={cn("h-4 w-4", status.color)} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{order.discord_username}</p>
                    <p className="text-sm text-muted-foreground">{order.products?.name || "Produto"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">R$ {Number(order.total_amount).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
