import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { BotActivity } from "@/components/dashboard/BotActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DollarSign, ShoppingCart, Users, TrendingUp, Loader2 } from "lucide-react";
import { useOrders, useOrdersRealtime } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";

const Index = () => {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: products, isLoading: productsLoading } = useProducts();
  
  // Enable realtime updates
  useOrdersRealtime();

  const isLoading = ordersLoading || productsLoading;

  // Calculate stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = orders?.filter((o) => new Date(o.created_at) >= today) || [];
  const paidOrders = orders?.filter((o) => o.status === "paid" || o.status === "delivered") || [];
  const todayRevenue = todayOrders
    .filter((o) => o.status === "paid" || o.status === "delivered")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const uniqueCustomers = new Set(orders?.map((o) => o.discord_user_id)).size;
  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

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
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu bot de vendas Discord
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Vendas Hoje"
            value={`R$ ${todayRevenue.toFixed(2)}`}
            change={`${todayOrders.length} pedidos`}
            changeType="positive"
            icon={DollarSign}
            iconColor="text-success"
          />
          <StatsCard
            title="Total de Pedidos"
            value={orders?.length.toString() || "0"}
            change={`${paidOrders.length} pagos`}
            changeType="positive"
            icon={ShoppingCart}
            iconColor="text-primary"
          />
          <StatsCard
            title="Clientes Únicos"
            value={uniqueCustomers.toString()}
            change="total"
            changeType="positive"
            icon={Users}
            iconColor="text-accent"
          />
          <StatsCard
            title="Receita Total"
            value={`R$ ${totalRevenue.toFixed(2)}`}
            change={`${products?.length || 0} produtos`}
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-warning"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentSales orders={orders || []} />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <BotActivity orders={orders || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
