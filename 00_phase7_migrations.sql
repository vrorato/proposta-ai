-- Adicionando novas colunas à tabela profiles
ALTER TABLE public.profiles
ADD COLUMN company_document text,
ADD COLUMN company_address text,
ADD COLUMN brand_font text,
ADD COLUMN default_tone text,
ADD COLUMN default_currency text,
ADD COLUMN default_expiration_days integer,
ADD COLUMN default_payment_terms text,
ADD COLUMN default_terms_conditions text,
ADD COLUMN digital_signature_url text,
ADD COLUMN professional_description text,
ADD COLUMN main_services text,
ADD COLUMN professional_differentials text,
ADD COLUMN portfolio_links text;

-- Criando um novo bucket público para upload de logos e assinaturas
insert into storage.buckets (id, name, public) 
values ('brands', 'brands', true);

-- Políticas de segurança (RLS) para o bucket 'brands'
create policy "Qualquer pessoa pode visualizar imagens das marcas"
on storage.objects for select
to public
using ( bucket_id = 'brands' );

create policy "Usuários autenticados podem subir imagens da marca"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'brands' );

create policy "Usuários podem deletar e atualizar apenas suas próprias imagens da marca"
on storage.objects for update
to authenticated
using ( bucket_id = 'brands' AND auth.uid() = owner);

create policy "Usuários podem deletar suas imagens"
on storage.objects for delete
to authenticated
using ( bucket_id = 'brands' AND auth.uid() = owner);
