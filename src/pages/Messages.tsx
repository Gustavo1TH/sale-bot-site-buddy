import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, MessageSquare, Zap, ShoppingCart, HelpCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const messageTemplates = [
  {
    id: "welcome",
    name: "Mensagem de Boas-vindas",
    icon: MessageSquare,
    description: "Enviada quando um novo usuário entra no servidor",
    content: "👋 Olá {user}! Bem-vindo à nossa loja!\n\nDigite !menu para ver nossos produtos disponíveis.",
  },
  {
    id: "purchase",
    name: "Confirmação de Compra",
    icon: ShoppingCart,
    description: "Enviada após uma compra bem-sucedida",
    content: "✅ Compra realizada com sucesso!\n\n📦 Produto: {product}\n💰 Valor: {price}\n🔑 Seu código: {code}\n\nObrigado pela compra!",
  },
  {
    id: "command",
    name: "Resposta a Comandos",
    icon: Zap,
    description: "Resposta padrão para comandos do bot",
    content: "📋 **Menu de Comandos**\n\n!produtos - Ver produtos disponíveis\n!comprar [id] - Comprar um produto\n!saldo - Ver seu saldo\n!ajuda - Obter ajuda",
  },
  {
    id: "support",
    name: "Mensagem de Suporte",
    icon: HelpCircle,
    description: "Enviada quando um usuário pede ajuda",
    content: "🆘 Precisa de ajuda?\n\nEntre em contato com nosso suporte:\n📧 Email: suporte@exemplo.com\n💬 Discord: Admin#0001\n\nHorário: 9h às 18h",
  },
];

const Messages = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(messageTemplates[0]);
  const [editedContent, setEditedContent] = useState(messageTemplates[0].content);

  const handleSelectTemplate = (template: typeof messageTemplates[0]) => {
    setSelectedTemplate(template);
    setEditedContent(template.content);
  };

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
          <Button variant="glow">
            <Plus className="h-4 w-4" />
            Novo Template
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
                  onClick={() => handleSelectTemplate(template)}
                  className={cn(
                    "w-full glass-card rounded-xl p-4 text-left transition-all duration-200",
                    selectedTemplate.id === template.id
                      ? "border-primary/50 bg-primary/5"
                      : "hover:border-border/80"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "rounded-lg p-2",
                        selectedTemplate.id === template.id
                          ? "bg-primary/20"
                          : "bg-secondary"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          selectedTemplate.id === template.id
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
                    Nome do Template
                  </label>
                  <Input
                    value={selectedTemplate.name}
                    className="mt-1.5 bg-secondary/50"
                    readOnly
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Conteúdo da Mensagem
                  </label>
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="mt-1.5 min-h-[200px] bg-secondary/50 font-mono text-sm"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Use variáveis: {"{user}"}, {"{product}"}, {"{price}"},{" "}
                    {"{code}"}
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancelar</Button>
                  <Button variant="glow">
                    <Save className="h-4 w-4" />
                    Salvar Alterações
                  </Button>
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
                      {editedContent
                        .replace("{user}", "@João")
                        .replace("{product}", "Plano Premium")
                        .replace("{price}", "R$ 199,90")
                        .replace("{code}", "XXXX-XXXX-XXXX")}
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
