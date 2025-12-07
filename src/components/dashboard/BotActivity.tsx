import { MessageSquare, ShoppingCart, UserPlus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "message",
    content: "Novo comando recebido: !comprar",
    user: "User#1234",
    time: "Agora",
  },
  {
    id: 2,
    type: "sale",
    content: "Venda processada com sucesso",
    user: "Cliente#5678",
    time: "Há 2 min",
  },
  {
    id: 3,
    type: "user",
    content: "Novo usuário registrado",
    user: "Novo#9012",
    time: "Há 5 min",
  },
  {
    id: 4,
    type: "alert",
    content: "Estoque baixo: Plano VIP",
    user: "Sistema",
    time: "Há 10 min",
  },
  {
    id: 5,
    type: "message",
    content: "Mensagem de suporte recebida",
    user: "User#3456",
    time: "Há 15 min",
  },
];

const typeConfig = {
  message: {
    icon: MessageSquare,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  sale: {
    icon: ShoppingCart,
    color: "text-success",
    bg: "bg-success/10",
  },
  user: {
    icon: UserPlus,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  alert: {
    icon: AlertCircle,
    color: "text-warning",
    bg: "bg-warning/10",
  },
};

export function BotActivity() {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground">Atividade do Bot</h3>
      <p className="text-sm text-muted-foreground">Eventos em tempo real</p>

      <div className="mt-6 space-y-3">
        {activities.map((activity, index) => {
          const config = typeConfig[activity.type as keyof typeof typeConfig];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn("mt-0.5 rounded-lg p-2", config.bg)}>
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {activity.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
