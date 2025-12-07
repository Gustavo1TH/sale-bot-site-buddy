-- Add mercado_pago_access_token to bot_settings
ALTER TABLE public.bot_settings 
ADD COLUMN IF NOT EXISTS mercado_pago_access_token text;