import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DiscordChannel {
  id: string;
  name: string;
  position: number;
}

export const useDiscordChannels = () => {
  return useQuery({
    queryKey: ["discord-channels"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("discord-channels");
      
      if (error) {
        console.error("Erro ao buscar canais:", error);
        return [];
      }
      
      return (data?.channels || []) as DiscordChannel[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });
};