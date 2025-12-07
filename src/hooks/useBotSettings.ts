import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BotSettings {
  id: string;
  discord_token: string | null;
  guild_id: string | null;
  mercado_pago_access_token: string | null;
  welcome_message: string | null;
  purchase_message: string | null;
  payment_pending_message: string | null;
  delivery_message: string | null;
  created_at: string;
  updated_at: string;
}

export const useBotSettings = () => {
  return useQuery({
    queryKey: ["bot-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bot_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as BotSettings | null;
    },
  });
};

export const useUpdateBotSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<BotSettings>) => {
      const { data: existing } = await supabase
        .from("bot_settings")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (existing) {
        const { data: settings, error } = await supabase
          .from("bot_settings")
          .update(data)
          .eq("id", existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return settings;
      } else {
        const { data: settings, error } = await supabase
          .from("bot_settings")
          .insert(data)
          .select()
          .single();
        
        if (error) throw error;
        return settings;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bot-settings"] });
      queryClient.invalidateQueries({ queryKey: ["discord-channels"] });
      toast.success("Configurações salvas!");
    },
    onError: (error) => {
      toast.error("Erro ao salvar configurações: " + error.message);
    },
  });
};