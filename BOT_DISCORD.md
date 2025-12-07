# Bot Discord de Vendas

## Configuração

1. **No Painel Web:**
   - Vá em Configurações e adicione o Token do Bot Discord
   - Configure os produtos com o ID do canal de cada um

2. **Configure o Webhook do Mercado Pago:**
   - Copie a URL do webhook nas configurações
   - Adicione em: Mercado Pago → Suas integrações → Webhooks

## Código do Bot (Node.js)

Crie um novo projeto Node.js e instale as dependências:

```bash
npm init -y
npm install discord.js @supabase/supabase-js
```

Crie o arquivo `bot.js`:

```javascript
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

// Configurações - substitua com seus valores
const SUPABASE_URL = 'https://ggzelxuawzpycqtbzocc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnemVseHVhd3pweWNxdGJ6b2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNzMyODksImV4cCI6MjA4MDY0OTI4OX0.w0Xo6OxPVnMF_FDh_PBsC4S-zfUYkiZ0anUSId2uzw0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let DISCORD_TOKEN = '';
let botSettings = null;

async function loadSettings() {
  const { data } = await supabase.from('bot_settings').select('*').limit(1).single();
  botSettings = data;
  DISCORD_TOKEN = data?.discord_token;
  return data;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// Quando o bot estiver pronto
client.once('ready', async () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
  
  // Enviar produtos para os canais configurados
  await sendProductsToChannels();
});

// Enviar produtos para os canais
async function sendProductsToChannels() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true);

  for (const product of products || []) {
    if (!product.discord_channel_id) continue;

    try {
      const channel = await client.channels.fetch(product.discord_channel_id);
      if (!channel) continue;

      const embed = new EmbedBuilder()
        .setTitle(`🛒 ${product.name}`)
        .setDescription(product.description || 'Produto disponível!')
        .addFields(
          { name: '💰 Preço', value: `R$ ${product.price.toFixed(2)}`, inline: true },
          { name: '📦 Estoque', value: product.stock.toString(), inline: true }
        )
        .setColor(0x7C3AED)
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`buy_${product.id}`)
          .setLabel('🛒 Comprar')
          .setStyle(ButtonStyle.Primary)
      );

      await channel.send({ embeds: [embed], components: [row] });
      console.log(`✅ Produto "${product.name}" enviado para o canal`);
    } catch (error) {
      console.error(`Erro ao enviar produto ${product.name}:`, error.message);
    }
  }
}

// Quando um botão é clicado
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const [action, productId] = interaction.customId.split('_');

  if (action === 'buy') {
    await handleBuyButton(interaction, productId);
  } else if (action === 'confirmpix') {
    await handleConfirmPix(interaction, productId);
  }
});

// Processar compra
async function handleBuyButton(interaction, productId) {
  await interaction.deferReply({ ephemeral: true });

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (!product || product.stock <= 0) {
    return interaction.editReply('❌ Produto indisponível!');
  }

  // Criar pedido
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      product_id: productId,
      discord_user_id: interaction.user.id,
      discord_username: interaction.user.username,
      quantity: 1,
      total_amount: product.price,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar pedido:', error);
    return interaction.editReply('❌ Erro ao processar. Tente novamente.');
  }

  // Gerar PIX
  const pixResponse = await fetch(`${SUPABASE_URL}/functions/v1/generate-pix`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: order.id,
      amount: product.price,
      description: product.name,
    }),
  });

  const pixData = await pixResponse.json();

  if (!pixData.success) {
    return interaction.editReply('❌ Erro ao gerar PIX. Tente novamente.');
  }

  // Enviar QR Code na DM
  try {
    const dm = await interaction.user.createDM();
    
    const embed = new EmbedBuilder()
      .setTitle('💳 Pagamento PIX')
      .setDescription(`**${product.name}**\n\nValor: R$ ${product.price.toFixed(2)}`)
      .addFields({ name: '📋 Código PIX', value: `\`\`\`${pixData.qrCode}\`\`\`` })
      .setImage(`data:image/png;base64,${pixData.qrCodeBase64}`)
      .setColor(0x00FF00)
      .setFooter({ text: 'O produto será enviado automaticamente após a confirmação' });

    await dm.send({ embeds: [embed] });
    await interaction.editReply('✅ PIX enviado na sua DM! Verifique suas mensagens privadas.');
  } catch {
    await interaction.editReply('❌ Não foi possível enviar DM. Habilite mensagens privadas.');
  }
}

// Monitorar pagamentos confirmados
async function monitorPayments() {
  const channel = supabase
    .channel('orders-paid')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, async (payload) => {
      const order = payload.new;
      
      if (order.status === 'paid' && !order.delivered_at) {
        await deliverProduct(order);
      }
    })
    .subscribe();
}

// Entregar produto
async function deliverProduct(order) {
  try {
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', order.product_id)
      .single();

    const user = await client.users.fetch(order.discord_user_id);
    const dm = await user.createDM();

    const message = botSettings?.delivery_message?.replace('{code}', product.delivery_content) 
      || `🎁 Seu produto:\n\n\`\`\`${product.delivery_content}\`\`\``;

    await dm.send(message);

    // Atualizar como entregue
    await supabase
      .from('orders')
      .update({ status: 'delivered', delivered_at: new Date().toISOString() })
      .eq('id', order.id);

    // Diminuir estoque
    await supabase
      .from('products')
      .update({ stock: product.stock - 1 })
      .eq('id', product.id);

    console.log(`✅ Produto entregue para ${order.discord_username}`);
  } catch (error) {
    console.error('Erro ao entregar produto:', error);
  }
}

// Iniciar bot
async function start() {
  await loadSettings();
  
  if (!DISCORD_TOKEN) {
    console.error('❌ Token do Discord não configurado! Configure no painel web.');
    process.exit(1);
  }

  await client.login(DISCORD_TOKEN);
  monitorPayments();
}

start();
```

## Como Rodar

```bash
node bot.js
```

O bot irá:
1. Enviar produtos nos canais configurados
2. Gerar PIX quando alguém clicar em "Comprar"
3. Entregar automaticamente o produto na DM quando o pagamento for confirmado
