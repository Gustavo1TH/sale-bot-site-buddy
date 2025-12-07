import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, MessageSquare, ShoppingCart, CreditCard, Gift, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useBotSettings, useUpdateBotSettings } from "@/hooks/useBotSettings";

const messageTemplates = [
  {
    id: "welcome_message",
    name: "Mensagem de Boas-vindas",
    icon: MessageSquare,
    description: "Enviada quando um novo usuário entra no servidor",
    variables: ["{user}"],
  },
  {
    id: "purchase_message",
    name: "Confirmação de Compra",
    icon: ShoppingCart,
    description: "Enviada após o pagamento ser confirmado",
    variables: ["{user}", "{product}", "{price}"],
  },
  {
    id: "payment_pending_message",
    name: "Pagamento Pendente",
    icon: CreditCard,
    description: "Enviada quando o PIX é gerado",
    variables: ["{product}", "{price}"],
  },
  {
    id: "delivery_message",
    name: "Entrega do Produto",
    icon: Gift,
    description: "Enviada na DM com o conteúdo do produto",
    variables: ["{code}"],
  },
];

const Messages = () => {
  const { data: settings, isLoading } = useBotSettings();
  const updateSettings = useUpdateBotSettings();
  
  const [selectedTemplateId, setSelectedTemplateId] = useState("welcome_message");
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      setMessages({
        welcome_message: settings.welcome_message || "",
        purchase_message: settings.purchase_message || "",
        payment_pending_message: settings.payment_pending_message || "",
        delivery_message: settings.delivery_message || "",
      });
    }
  }, [settings]);

  const selectedTemplate = messageTemplates.find((t) => t.id === selectedTemplateId)!;
  const currentContent = messages[selectedTemplateId] || "";

  const handleContentChange = (content: string) => {
    setMessages((prev) => ({ ...prev, [selectedTemplateId]: content }));
  };

  const handleSave = async () => {
    await updateSettings.mutateAsync({
      welcome_message: messages.welcome_message,
      purchase_message: messages.purchase_message,
      payment_pending_message: messages.payment_pending_message,
      delivery_message: messages.delivery_message,
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mensagens</h1>
            <p className="text-muted-foreground">
              Configure os templates de mensagens do bot
            </p>
          </div>
          <Button 
            variant="glow" 
            onClick={handleSave}
            disabled={updateSettings.isPending}
          >
            {updateSettings.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar Alterações
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Template List */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Templates Disponíveis
            </h3>
            {messageTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={cn(
                    "w-full glass-card rounded-xl p-4 text-left transition-all duration-200",
                    selectedTemplateId === template.id
                      ? "border-primary/50 bg-primary/5"
                      : "hover:border-border/80"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "rounded-lg p-2",
                        selectedTemplateId === template.id
                          ? "bg-primary/20"
                          : "bg-secondary"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          selectedTemplateId === template.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {template.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Editor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card rounded-xl p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Conteúdo da Mensagem
                  </label>
                  <Textarea
                    value={currentContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="mt-1.5 min-h-[200px] bg-secondary/50 font-mono text-sm"
                    placeholder="Digite o conteúdo da mensagem..."
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground">Variáveis:</span>
                    {selectedTemplate.variables.map((v) => (
                      <code
                        key={v}
                        className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary cursor-pointer hover:bg-primary/20"
                        onClick={() => handleContentChange(currentContent + v)}
                      >
                        {v}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Pré-visualização
              </h3>
              <div className="mt-4 rounded-lg bg-[#36393f] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <MessageSquare className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        SalesBot
                      </span>
                      <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs font-medium text-primary">
                        BOT
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Hoje às 12:00
                      </span>
                    </div>
                    <div className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">
                      {currentContent
                        .replace("{user}", "@João")
                        .replace("{product}", "Plano Premium")
                        .replace("{price}", "199,90")
                        .replace("{code}", "XXXX-XXXX-XXXX-XXXX")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
