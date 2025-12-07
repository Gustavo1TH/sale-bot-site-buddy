import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendMessageRequest {
  action: 'send_dm' | 'send_channel' | 'get_user';
  userId?: string;
  channelId?: string;
  message?: string;
  embed?: object;
  components?: object[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Buscar token do Discord das configurações
    const { data: settings } = await supabase
      .from('bot_settings')
      .select('discord_token')
      .limit(1)
      .single();

    const DISCORD_TOKEN = settings?.discord_token;
    
    if (!DISCORD_TOKEN) {
      throw new Error('Token do Discord não configurado');
    }

    const { action, userId, channelId, message, embed, components } = await req.json() as SendMessageRequest;
    
    const discordBaseUrl = 'https://discord.com/api/v10';
    const headers = {
      'Authorization': `Bot ${DISCORD_TOKEN}`,
      'Content-Type': 'application/json',
    };

    let result;

    switch (action) {
      case 'send_dm': {
        // Criar canal DM com o usuário
        const dmChannelResponse = await fetch(`${discordBaseUrl}/users/@me/channels`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ recipient_id: userId }),
        });
        
        const dmChannel = await dmChannelResponse.json();
        console.log('Canal DM criado:', dmChannel);

        if (!dmChannel.id) {
          throw new Error('Erro ao criar canal DM');
        }

        // Enviar mensagem
        const messagePayload: any = {};
        if (message) messagePayload.content = message;
        if (embed) messagePayload.embeds = [embed];
        if (components) messagePayload.components = components;

        const messageResponse = await fetch(`${discordBaseUrl}/channels/${dmChannel.id}/messages`, {
          method: 'POST',
          headers,
          body: JSON.stringify(messagePayload),
        });

        result = await messageResponse.json();
        console.log('Mensagem DM enviada:', result);
        break;
      }

      case 'send_channel': {
        const messagePayload: any = {};
        if (message) messagePayload.content = message;
        if (embed) messagePayload.embeds = [embed];
        if (components) messagePayload.components = components;

        const messageResponse = await fetch(`${discordBaseUrl}/channels/${channelId}/messages`, {
          method: 'POST',
          headers,
          body: JSON.stringify(messagePayload),
        });

        result = await messageResponse.json();
        console.log('Mensagem enviada no canal:', result);
        break;
      }

      case 'get_user': {
        const userResponse = await fetch(`${discordBaseUrl}/users/${userId}`, {
          headers,
        });

        result = await userResponse.json();
        console.log('Usuário obtido:', result);
        break;
      }

      default:
        throw new Error('Ação inválida');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Erro na API Discord:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
