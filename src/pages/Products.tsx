import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, MoreVertical, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const products = [
  {
    id: 1,
    name: "Plano Premium",
    description: "Acesso completo a todos os recursos",
    price: "R$ 199,90",
    stock: 999,
    status: "active",
    sales: 234,
  },
  {
    id: 2,
    name: "Plano Basic",
    description: "Recursos essenciais para começar",
    price: "R$ 99,90",
    stock: 999,
    status: "active",
    sales: 567,
  },
  {
    id: 3,
    name: "VIP Mensal",
    description: "Benefícios exclusivos por 30 dias",
    price: "R$ 299,90",
    stock: 50,
    status: "active",
    sales: 89,
  },
  {
    id: 4,
    name: "Créditos x100",
    description: "Pacote com 100 créditos",
    price: "R$ 49,90",
    stock: 0,
    status: "out_of_stock",
    sales: 1234,
  },
  {
    id: 5,
    name: "Créditos x500",
    description: "Pacote com 500 créditos + bônus",
    price: "R$ 199,90",
    stock: 500,
    status: "active",
    sales: 456,
  },
];

const Products = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
            <p className="text-muted-foreground">
              Gerencie os produtos disponíveis para venda
            </p>
          </div>
          <Button variant="glow">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              className="bg-secondary/50 pl-10"
            />
          </div>
          <Button variant="outline">Filtrar</Button>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="glass-card rounded-xl p-6 transition-all duration-300 hover:border-primary/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">
                  {product.price}
                </span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    product.status === "active"
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {product.status === "active" ? "Ativo" : "Sem Estoque"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
                <span>Estoque: {product.stock}</span>
                <span>{product.sales} vendas</span>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="mr-1 h-3 w-3" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Products;
