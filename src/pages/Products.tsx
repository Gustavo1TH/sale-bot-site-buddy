import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, MoreVertical, Package, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product, CreateProductData } from "@/hooks/useProducts";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProductForm = ({ 
  product, 
  onSubmit, 
  onClose,
  isLoading 
}: { 
  product?: Product; 
  onSubmit: (data: CreateProductData) => void;
  onClose: () => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState<CreateProductData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    discord_channel_id: product?.discord_channel_id || "",
    delivery_content: product?.delivery_content || "",
    active: product?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nome do Produto</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Plano Premium"
          required
          className="mt-1.5 bg-secondary/50"
        />
      </div>

      <div>
        <Label>Descrição</Label>
        <Textarea
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descrição do produto..."
          className="mt-1.5 bg-secondary/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Preço (R$)</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            placeholder="99.90"
            required
            className="mt-1.5 bg-secondary/50"
          />
        </div>
        <div>
          <Label>Estoque</Label>
          <Input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            placeholder="100"
            required
            className="mt-1.5 bg-secondary/50"
          />
        </div>
      </div>

      <div>
        <Label>ID do Canal Discord</Label>
        <Input
          value={formData.discord_channel_id || ""}
          onChange={(e) => setFormData({ ...formData, discord_channel_id: e.target.value })}
          placeholder="Ex: 123456789012345678"
          className="mt-1.5 bg-secondary/50"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Canal onde o produto será anunciado
        </p>
      </div>

      <div>
        <Label>Conteúdo de Entrega</Label>
        <Textarea
          value={formData.delivery_content}
          onChange={(e) => setFormData({ ...formData, delivery_content: e.target.value })}
          placeholder="Código, link ou conteúdo que será entregue após a compra..."
          required
          className="mt-1.5 bg-secondary/50 min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Este conteúdo será enviado na DM do cliente após o pagamento
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="glow" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {product ? "Atualizar" : "Criar Produto"}
        </Button>
      </div>
    </form>
  );
};

const Products = () => {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProduct = async (data: CreateProductData) => {
    await createProduct.mutateAsync(data);
    setIsDialogOpen(false);
  };

  const handleUpdateProduct = async (data: CreateProductData) => {
    if (!editingProduct) return;
    await updateProduct.mutateAsync({ id: editingProduct.id, ...data });
    setEditingProduct(undefined);
    setIsDialogOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      await deleteProduct.mutateAsync(id);
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingProduct(undefined);
    setIsDialogOpen(true);
  };

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="glow" onClick={openCreateDialog}>
                <Plus className="h-4 w-4" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Editar Produto" : "Novo Produto"}
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                product={editingProduct}
                onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
                onClose={() => setIsDialogOpen(false)}
                isLoading={createProduct.isPending || updateProduct.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/50 pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Nenhum produto</h3>
            <p className="text-muted-foreground">
              Clique em "Novo Produto" para adicionar seu primeiro produto
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts?.map((product) => (
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
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {product.description || "Sem descrição"}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      product.stock > 0 && product.active
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {product.stock > 0 && product.active ? "Ativo" : "Indisponível"}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
                  <span>Estoque: {product.stock}</span>
                  {product.discord_channel_id && (
                    <span className="text-xs">Canal configurado</span>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => openEditDialog(product)}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={deleteProduct.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Products;
