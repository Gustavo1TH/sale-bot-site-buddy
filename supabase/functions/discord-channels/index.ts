import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Buscar configurações do bot
    const { data: settings } = await supabase
      .from('bot_settings')
      .select('discord_token, guild_id')
      .limit(1)
      .single();

    if (!settings?.discord_token) {
      throw new Error('Token do Discord não configurado');
    }

    if (!settings?.guild_id) {
      throw new Error('ID do servidor não configurado');
    }

    const discordBaseUrl = 'https://discord.com/api/v10';
    const headers = {
      'Authorization': `Bot ${settings.discord_token}`,
      'Content-Type': 'application/json',
    };

    // Buscar canais do servidor
    const channelsResponse = await fetch(
      `${discordBaseUrl}/guilds/${settings.guild_id}/channels`,
      { headers }
    );

    if (!channelsResponse.ok) {
      const error = await channelsResponse.json();
      console.error('Erro ao buscar canais:', error);
      throw new Error('Erro ao buscar canais do Discord');
    }

    const channels = await channelsResponse.json();
    console.log('Canais obtidos:', channels.length);

    // Filtrar apenas canais de texto (type 0)
    const textChannels = channels
      .filter((channel: any) => channel.type === 0)
      .map((channel: any) => ({
        id: channel.id,
        name: channel.name,
        position: channel.position,
      }))
      .sort((a: any, b: any) => a.position - b.position);

    return new Response(JSON.stringify({ channels: textChannels }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar canais:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(JSON.stringify({ error: message, channels: [] }), {
      status: 200, // Retorna 200 mesmo com erro para não quebrar o frontend
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});