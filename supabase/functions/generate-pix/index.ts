import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PixRequest {
  orderId: string;
  amount: number;
  description: string;
  payerEmail?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Buscar token do Mercado Pago das configurações
    const { data: settings } = await supabase
      .from('bot_settings')
      .select('mercado_pago_access_token')
      .limit(1)
      .single();

    const MERCADO_PAGO_ACCESS_TOKEN = settings?.mercado_pago_access_token || Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');

    if (!MERCADO_PAGO_ACCESS_TOKEN) {
      throw new Error('Token do Mercado Pago não configurado');
    }

    const { orderId, amount, description, payerEmail } = await req.json() as PixRequest;

    console.log('Gerando PIX para pedido:', orderId, 'Valor:', amount);

    // Criar pagamento PIX no Mercado Pago
    const pixPayload = {
      transaction_amount: amount,
      description: description,
      payment_method_id: 'pix',
      payer: {
        email: payerEmail || 'cliente@email.com',
      },
      external_reference: orderId,
    };

    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': orderId,
      },
      body: JSON.stringify(pixPayload),
    });

    const mpData = await mpResponse.json();
    console.log('Resposta Mercado Pago:', mpData);

    if (!mpResponse.ok) {
      throw new Error(`Erro Mercado Pago: ${JSON.stringify(mpData)}`);
    }

    const pixQrCode = mpData.point_of_interaction?.transaction_data?.qr_code;
    const pixQrCodeBase64 = mpData.point_of_interaction?.transaction_data?.qr_code_base64;
    const transactionId = mpData.id?.toString();

    // Atualizar pedido com dados do PIX
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        pix_transaction_id: transactionId,
        pix_qr_code: pixQrCode,
        pix_qr_code_base64: pixQrCodeBase64,
        status: 'awaiting_payment',
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Erro ao atualizar pedido:', updateError);
      throw updateError;
    }

    return new Response(JSON.stringify({
      success: true,
      transactionId,
      qrCode: pixQrCode,
      qrCodeBase64: pixQrCodeBase64,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Erro ao gerar PIX:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
