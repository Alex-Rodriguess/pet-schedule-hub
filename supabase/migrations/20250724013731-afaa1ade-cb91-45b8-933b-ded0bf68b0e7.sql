-- Criar bucket para fotos de pets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('pet-photos', 'pet-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Criar políticas para o bucket pet-photos
CREATE POLICY "Pet photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'pet-photos');

CREATE POLICY "Authenticated users can upload pet photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'pet-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update pet photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'pet-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete pet photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'pet-photos' AND auth.role() = 'authenticated');