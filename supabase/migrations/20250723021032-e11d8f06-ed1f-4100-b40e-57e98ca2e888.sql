-- Adicionar campo de pelagem na tabela pets
ALTER TABLE public.pets ADD COLUMN coat_type text;

-- Comentário da tabela pets para incluir informações sobre pelagem
COMMENT ON COLUMN public.pets.coat_type IS 'Tipo de pelagem do pet (ex: curto, longo, ondulado, etc.)';

-- Atualizar função de update_updated_at_column para pets se não existir
CREATE TRIGGER update_pets_updated_at
    BEFORE UPDATE ON public.pets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();