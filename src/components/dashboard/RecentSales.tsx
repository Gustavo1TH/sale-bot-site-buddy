import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const sales = [
  {
    id: 1,
    customer: "João Silva",
    product: "Plano Premium",
    amount: "R$ 199,90",
    status: "completed",
    time: "Há 5 min",
  },
  {
    id: 2,
    customer: "Maria Santos",
    product: "Créditos x100",
    amount: "R$ 49,90",
    status: "pending",
    time: "Há 12 min",
  },
  {
    id: 3,
    customer: "Pedro Costa",
    product: "VIP Mensal",
    amount: "R$ 299,90",
    status: "completed",
    time: "Há 25 min",
  },
  {
    id: 4,
    customer: "Ana Oliveira",
    product: "Plano Basic",
    amount: "R$ 99,90",
    status: "failed",
    time: "Há 1 hora",
  },
  {
    id: 5,
    customer: "Lucas Mendes",
    product: "Créditos x500",
    amount: "R$ 199,90",
    status: "completed",
    time: "Há 2 horas",
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
    label: "Concluído",
  },
  pending: {
    icon: Clock,
    color: "text-warning",
    bg: "bg-warning/10",
    label: "Pendente",
  },
  failed: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    label: "Falhou",
  },
};

export function RecentSales() {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground">Vendas Recentes</h3>
      <p className="text-sm text-muted-foreground">Últimas transações do bot</p>

      <div className="mt-6 space-y-4">
        {sales.map((sale) => {
          const status = statusConfig[sale.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <div
              key={sale.id}
              className="flex items-center justify-between rounded-lg bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
            >
              <div className="flex items-center gap-4">
                <div className={cn("rounded-lg p-2", status.bg)}>
                  <StatusIcon className={cn("h-4 w-4", status.color)} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{sale.customer}</p>
                  <p className="text-sm text-muted-foreground">{sale.product}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{sale.amount}</p>
                <p className="text-xs text-muted-foreground">{sale.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
