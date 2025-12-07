import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { BotActivity } from "@/components/dashboard/BotActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

const Index = () => {
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
            value="R$ 2.450"
            change="+12% vs ontem"
            changeType="positive"
            icon={DollarSign}
            iconColor="text-success"
          />
          <StatsCard
            title="Pedidos"
            value="48"
            change="+8% vs ontem"
            changeType="positive"
            icon={ShoppingCart}
            iconColor="text-primary"
          />
          <StatsCard
            title="Novos Clientes"
            value="124"
            change="+23% este mês"
            changeType="positive"
            icon={Users}
            iconColor="text-accent"
          />
          <StatsCard
            title="Taxa de Conversão"
            value="3.2%"
            change="-0.3% vs média"
            changeType="negative"
            icon={TrendingUp}
            iconColor="text-warning"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentSales />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <BotActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
