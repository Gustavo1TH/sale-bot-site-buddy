import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Bot, Key, Globe, Loader2, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useBotSettings, useUpdateBotSettings } from "@/hooks/useBotSettings";
import { toast } from "sonner";

const Settings = () => {
  const { data: settings, isLoading } = useBotSettings();
  const updateSettings = useUpdateBotSettings();
  
  const [formData, setFormData] = useState({
    discord_token: "",
    guild_id: "",
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        discord_token: settings.discord_token || "",
        guild_id: settings.guild_id || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    await updateSettings.mutateAsync(formData);
  };

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/webhook-mercadopago`;

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success("URL copiada!");
    setTimeout(() => setCopied(false), 2000);
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
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Configure as opções do seu bot Discord
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bot Configuration */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-primary/10 p-3">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Configuração do Bot
                </h3>
                <p className="text-sm text-muted-foreground">
                  Credenciais e IDs do Discord
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Token do Bot
                </label>
                <Input
                  type="password"
                  placeholder="Seu token do bot Discord"
                  value={formData.discord_token}
                  onChange={(e) => setFormData({ ...formData, discord_token: e.target.value })}
                  className="mt-1.5 bg-secondary/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Obtenha em discord.com/developers/applications
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  ID do Servidor (Guild)
                </label>
                <Input
                  placeholder="Ex: 123456789012345678"
                  value={formData.guild_id}
                  onChange={(e) => setFormData({ ...formData, guild_id: e.target.value })}
                  className="mt-1.5 bg-secondary/50"
                />
              </div>
            </div>
          </div>

          {/* Webhook Mercado Pago */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-success/10 p-3">
                <Globe className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Webhook Mercado Pago
                </h3>
                <p className="text-sm text-muted-foreground">
                  Configure para receber notificações de pagamento
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  URL do Webhook
                </label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    value={webhookUrl}
                    readOnly
                    className="bg-secondary/50 font-mono text-xs"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={copyWebhookUrl}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Configure esta URL em: Mercado Pago → Suas integrações → Webhooks
                </p>
              </div>

              <div className="rounded-lg bg-warning/10 border border-warning/20 p-4">
                <h4 className="font-medium text-warning text-sm">Instruções</h4>
                <ol className="text-xs text-muted-foreground mt-2 space-y-1 list-decimal list-inside">
                  <li>Acesse o painel do Mercado Pago</li>
                  <li>Vá em "Suas integrações" → "Webhooks"</li>
                  <li>Cole a URL acima</li>
                  <li>Selecione o evento "payment"</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            variant="glow" 
            size="lg" 
            onClick={handleSave}
            disabled={updateSettings.isPending}
          >
            {updateSettings.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar Configurações
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
