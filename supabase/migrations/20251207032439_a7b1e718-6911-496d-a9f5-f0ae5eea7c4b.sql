-- Tabela de produtos
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  discord_channel_id TEXT,
  delivery_content TEXT NOT NULL,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de pedidos
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  discord_user_id TEXT NOT NULL,
  discord_username TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  pix_transaction_id TEXT,
  pix_qr_code TEXT,
  pix_qr_code_base64 TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de configurações do bot
CREATE TABLE public.bot_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_token TEXT,
  guild_id TEXT,
  welcome_message TEXT DEFAULT 'Olá {user}! Bem-vindo à nossa loja!',
  purchase_message TEXT DEFAULT 'Obrigado pela compra, {user}! Seu produto {product} foi enviado.',
  payment_pending_message TEXT DEFAULT 'Pagamento pendente para {product}. Valor: R$ {price}',
  delivery_message TEXT DEFAULT 'Aqui está seu produto:\n\n{code}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de carrinho
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_user_id TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para leitura de produtos (bot precisa ler)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Políticas para orders (público para o bot criar/ler)
CREATE POLICY "Orders are viewable by everyone" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Orders can be created by anyone" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Orders can be updated by anyone" 
ON public.orders 
FOR UPDATE 
USING (true);

-- Políticas para cart_items (público para o bot)
CREATE POLICY "Cart items are viewable by everyone" 
ON public.cart_items 
FOR SELECT 
USING (true);

CREATE POLICY "Cart items can be created by anyone" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Cart items can be deleted by anyone" 
ON public.cart_items 
FOR DELETE 
USING (true);

-- Políticas para bot_settings (público para leitura)
CREATE POLICY "Bot settings are viewable by everyone" 
ON public.bot_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Bot settings can be inserted by anyone" 
ON public.bot_settings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Bot settings can be updated by anyone" 
ON public.bot_settings 
FOR UPDATE 
USING (true);

-- Políticas para produtos (admin pode tudo)
CREATE POLICY "Products can be inserted by anyone" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Products can be updated by anyone" 
ON public.products 
FOR UPDATE 
USING (true);

CREATE POLICY "Products can be deleted by anyone" 
ON public.products 
FOR DELETE 
USING (true);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bot_settings_updated_at
BEFORE UPDATE ON public.bot_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar realtime para orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Inserir configuração inicial
INSERT INTO public.bot_settings (id, welcome_message, purchase_message, payment_pending_message, delivery_message)
VALUES (
  gen_random_uuid(),
  'Olá {user}! Bem-vindo à nossa loja! 🛒',
  'Obrigado pela compra, {user}! Seu produto {product} foi enviado para sua DM! ✅',
  '💳 Pagamento pendente para **{product}**\nValor: R$ {price}\n\nEscaneie o QR Code ou copie o código PIX para pagar.',
  '🎁 Aqui está seu produto:\n\n```{code}```\n\nObrigado pela compra!'
);