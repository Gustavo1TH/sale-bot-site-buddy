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
    const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    const body = await req.json();
    console.log('Webhook recebido:', JSON.stringify(body));

    // Mercado Pago envia notificações de pagamento
    if (body.type === 'payment' && body.data?.id) {
      const paymentId = body.data.id;
      
      // Buscar detalhes do pagamento
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          },
        }
      );

      const payment = await paymentResponse.json();
      console.log('Detalhes do pagamento:', payment);

      if (payment.status === 'approved') {
        const orderId = payment.external_reference;
        
        // Buscar pedido
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('*, products(*)')
          .eq('id', orderId)
          .single();

        if (orderError || !order) {
          console.error('Pedido não encontrado:', orderId);
          throw new Error('Pedido não encontrado');
        }

        // Atualizar status do pedido
        await supabase
          .from('orders')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        console.log('Pedido atualizado para pago:', orderId);

        // Aqui você pode adicionar a lógica para enviar o produto via Discord
        // Isso será feito pelo bot que monitora as mudanças de status
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Erro no webhook:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
