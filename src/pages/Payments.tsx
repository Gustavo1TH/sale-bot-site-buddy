import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, CreditCard, CheckCircle, Clock, XCircle, Package, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrders, useOrdersRealtime } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig = {
  pending: { label: "Pendente", icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  awaiting_payment: { label: "Aguardando Pagamento", icon: CreditCard, color: "text-primary", bg: "bg-primary/10" },
  paid: { label: "Pago", icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  delivered: { label: "Entregue", icon: Package, color: "text-success", bg: "bg-success/10" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

const Payments = () => {
  const { data: orders, isLoading, refetch } = useOrders();
  const { data: products } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");

  // Enable realtime updates
  useOrdersRealtime();

  const getProductName = (productId: string) => {
    const product = products?.find((p) => p.id === productId);
    return product?.name || "Produto desconhecido";
  };

  const filteredOrders = orders?.filter((order) =>
    order.discord_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getProductName(order.product_id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pagamentos</h1>
            <p className="text-muted-foreground">
              Acompanhe todos os pedidos e pagamentos
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por usuário ou produto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/50 pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-foreground">{orders?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-xl font-bold text-foreground">
                  {orders?.filter((o) => o.status === "pending" || o.status === "awaiting_payment").length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pagos</p>
                <p className="text-xl font-bold text-foreground">
                  {orders?.filter((o) => o.status === "paid" || o.status === "delivered").length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <Package className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entregues</p>
                <p className="text-xl font-bold text-foreground">
                  {orders?.filter((o) => o.status === "delivered").length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredOrders?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Nenhum pedido</h3>
            <p className="text-muted-foreground">
              Os pedidos aparecerão aqui quando forem criados
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders?.map((order) => {
                    const config = getStatusConfig(order.status);
                    const Icon = config.icon;
                    return (
                      <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {order.discord_username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">
                              {order.discord_username}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-foreground">
                          {getProductName(order.product_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-foreground">
                            R$ {Number(order.total_amount).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full w-fit", config.bg)}>
                            <Icon className={cn("h-4 w-4", config.color)} />
                            <span className={cn("text-xs font-medium", config.color)}>
                              {config.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {format(new Date(order.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Payments;