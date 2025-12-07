import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

export interface Order {
  id: string;
  product_id: string;
  discord_user_id: string;
  discord_username: string;
  quantity: number;
  total_amount: number;
  pix_transaction_id: string | null;
  pix_qr_code: string | null;
  pix_qr_code_base64: string | null;
  status: string;
  paid_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  products?: {
    name: string;
    price: number;
    delivery_content: string;
  };
}

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, products(name, price, delivery_content)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Order[];
    },
  });
};

export const useOrdersRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("Order change:", payload);
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Order, "id" | "created_at" | "updated_at" | "products">) => {
      const { data: order, error } = await supabase
        .from("orders")
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      toast.error("Erro ao criar pedido: " + error.message);
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Order> & { id: string }) => {
      const { data: order, error } = await supabase
        .from("orders")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      toast.error("Erro ao atualizar pedido: " + error.message);
    },
  });
};
