import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Save, Bot, Key, Webhook, Bell, Shield, Globe } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [botToken, setBotToken] = useState("");
  const [guildId, setGuildId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  
  const [settings, setSettings] = useState({
    autoReply: true,
    welcomeMessage: true,
    logTransactions: true,
    dmNotifications: false,
    maintenanceMode: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  className="mt-1.5 bg-secondary/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  ID do Servidor (Guild)
                </label>
                <Input
                  placeholder="Ex: 123456789012345678"
                  value={guildId}
                  onChange={(e) => setGuildId(e.target.value)}
                  className="mt-1.5 bg-secondary/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  ID do Canal de Vendas
                </label>
                <Input
                  placeholder="Ex: 123456789012345678"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  className="mt-1.5 bg-secondary/50"
                />
              </div>
            </div>
          </div>

          {/* Webhooks */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-primary/10 p-3">
                <Webhook className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Webhooks
                </h3>
                <p className="text-sm text-muted-foreground">
                  Integrações externas
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Webhook de Notificações
                </label>
                <Input
                  placeholder="https://discord.com/api/webhooks/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="mt-1.5 bg-secondary/50"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Usado para enviar logs de transações
                </p>
              </div>
            </div>
          </div>

          {/* Bot Settings */}
          <div className="glass-card rounded-xl p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-primary/10 p-3">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Opções do Bot
                </h3>
                <p className="text-sm text-muted-foreground">
                  Comportamento e funcionalidades
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  key: "autoReply",
                  label: "Resposta Automática",
                  description: "Responder automaticamente a comandos",
                },
                {
                  key: "welcomeMessage",
                  label: "Mensagem de Boas-vindas",
                  description: "Enviar mensagem para novos membros",
                },
                {
                  key: "logTransactions",
                  label: "Log de Transações",
                  description: "Registrar todas as vendas",
                },
                {
                  key: "dmNotifications",
                  label: "Notificações por DM",
                  description: "Enviar comprovantes por mensagem privada",
                },
                {
                  key: "maintenanceMode",
                  label: "Modo Manutenção",
                  description: "Desativar vendas temporariamente",
                },
              ].map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between rounded-lg bg-secondary/30 p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{setting.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                  <Switch
                    checked={settings[setting.key as keyof typeof settings]}
                    onCheckedChange={() =>
                      toggleSetting(setting.key as keyof typeof settings)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button variant="glow" size="lg">
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
