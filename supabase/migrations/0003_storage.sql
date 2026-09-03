-- =============================================================================
-- 0003_storage
--
-- Two buckets. The difference between them is the difference between a paid
-- product and a free one, so read the policies carefully before changing them.
--
-- NON-DESTRUCTIVE: creates only.
-- =============================================================================

-- public-assets   - product artwork, previews, OG images. Anyone may read.
-- protected-assets - deliverables. NOBODY may read through the API.
--
-- Protected files are served only by the download route, which verifies an
-- entitlement and then mints a short-lived signed URL with the service-role
-- client. Service-role bypasses RLS, so it needs no policy here - and adding a
-- read policy for authenticated users would hand every signed-in visitor every
-- paid file, which is the single worst mistake available in this codebase.

insert into storage.buckets (id, name, public)
values ('public-assets', 'public-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('protected-assets', 'protected-assets', false)
on conflict (id) do nothing;

-- --- public-assets -----------------------------------------------------------

create policy "public_assets_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'public-assets');

create policy "public_assets_admin_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'public-assets' and public.is_admin());

create policy "public_assets_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'public-assets' and public.is_admin())
  with check (bucket_id = 'public-assets' and public.is_admin());

create policy "public_assets_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'public-assets' and public.is_admin());

-- --- protected-assets --------------------------------------------------------
-- Admin upload only. Deliberately NO select policy for anon or authenticated.

create policy "protected_assets_admin_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'protected-assets' and public.is_admin());

create policy "protected_assets_admin_read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'protected-assets' and public.is_admin());

create policy "protected_assets_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'protected-assets' and public.is_admin())
  with check (bucket_id = 'protected-assets' and public.is_admin());

create policy "protected_assets_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'protected-assets' and public.is_admin());
