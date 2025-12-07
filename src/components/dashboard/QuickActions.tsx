import { Plus, RefreshCw, Download, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    icon: Plus,
    label: "Novo Produto",
    description: "Adicionar produto",
  },
  {
    icon: Send,
    label: "Enviar Mensagem",
    description: "Broadcast para todos",
  },
  {
    icon: RefreshCw,
    label: "Reiniciar Bot",
    description: "Reiniciar serviço",
  },
  {
    icon: Download,
    label: "Exportar Dados",
    description: "Baixar relatório",
  },
];

export function QuickActions() {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground">Ações Rápidas</h3>
      <p className="text-sm text-muted-foreground">Comandos frequentes</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto flex-col gap-2 py-4 hover:border-primary/50 hover:bg-primary/5"
          >
            <action.icon className="h-5 w-5 text-primary" />
            <div className="text-center">
              <p className="text-sm font-medium">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
