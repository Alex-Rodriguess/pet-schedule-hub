-- Adicionar campo de pelagem na tabela pets se não existir
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS coat_type text;

-- Comentário da tabela pets para incluir informações sobre pelagem
COMMENT ON COLUMN public.pets.coat_type IS 'Tipo de pelagem do pet (ex: curto, longo, ondulado, etc.)';