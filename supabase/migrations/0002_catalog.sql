-- =============================================================================
-- 0002_catalog
--
-- Categories, products, offers, assets and bundle membership.
-- See docs/DATABASE.md sections 3 to 5.
--
-- NON-DESTRUCTIVE: creates only. Depends on 0001_profiles for is_admin().
-- =============================================================================

-- --- Enums -------------------------------------------------------------------

create type public.product_type as enum (
  'download', 'template', 'prompt_system', 'workflow', 'automation',
  'database', 'course', 'tool', 'bundle', 'external_access'
);

create type public.product_status as enum ('draft', 'published', 'archived');

create type public.fulfillment_type as enum (
  'file', 'external_link', 'protected_page', 'video',
  'license_key', 'tool_access', 'subscription_access', 'instructions'
);

create type public.offer_kind as enum ('free', 'one_time', 'subscription');

-- --- categories --------------------------------------------------------------

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  parent_id   uuid references public.categories (id) on delete set null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),

  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint categories_no_self_parent check (parent_id is distinct from id)
);

alter table public.categories enable row level security;

-- --- products ----------------------------------------------------------------

create table public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  tagline         text,
  description     text,
  product_type    public.product_type not null,
  status          public.product_status not null default 'draft',
  category_id     uuid references public.categories (id) on delete set null,
  cover_image_url text,
  is_featured     boolean not null default false,
  requirements    text,
  license_terms   text,
  seo_title       text,
  seo_description text,
  og_image_url    text,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint products_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),

  -- A published product without a publish date breaks sorting and the sitemap.
  constraint products_published_has_date
    check (status <> 'published' or published_at is not null)
);

-- Full-text search. Weighted so a name match outranks a description match.
-- Replaces the substring matching used by the seed implementation.
alter table public.products
  add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(name, '')),        'A') ||
    setweight(to_tsvector('english', coalesce(tagline, '')),     'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored;

alter table public.products enable row level security;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- --- product_offers ----------------------------------------------------------
-- Separates what a product IS from how it is SOLD. Provider ids live here, so
-- re-pricing or changing payment provider never touches product content.

create table public.product_offers (
  id                  uuid primary key default gen_random_uuid(),
  product_id          uuid not null references public.products (id) on delete cascade,
  name                text not null,
  kind                public.offer_kind not null,
  price_cents         integer not null default 0,
  compare_at_cents    integer,
  currency            char(3) not null default 'USD',
  provider            text,
  provider_variant_id text,
  is_default          boolean not null default false,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),

  constraint offers_price_non_negative check (price_cents >= 0),
  constraint offers_free_is_zero check (kind <> 'free' or price_cents = 0),
  constraint offers_paid_is_positive check (kind = 'free' or price_cents > 0),
  constraint offers_compare_at_higher
    check (compare_at_cents is null or compare_at_cents > price_cents)
);

alter table public.product_offers enable row level security;

-- --- product_assets ----------------------------------------------------------
-- What the customer actually receives. One product may deliver several.

create table public.product_assets (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null references public.products (id) on delete cascade,
  fulfillment_type public.fulfillment_type not null,
  title            text not null,
  description      text,
  storage_path     text,
  external_url     text,
  body             text,
  tool_slug        text,
  file_size_bytes  bigint,
  is_preview       boolean not null default false,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),

  -- The right column must be populated for each type. A 'file' asset with no
  -- storage_path is a broken download waiting to happen after someone pays.
  constraint assets_payload_matches_type check (
    case fulfillment_type
      when 'file'                then storage_path is not null
      when 'video'               then storage_path is not null or external_url is not null
      when 'external_link'       then external_url is not null
      when 'protected_page'      then body is not null
      when 'instructions'        then body is not null
      when 'tool_access'         then tool_slug is not null
      else true
    end
  )
);

alter table public.product_assets enable row level security;

-- --- bundle_items ------------------------------------------------------------
-- A bundle is a product with product_type = 'bundle'; see docs/DATABASE.md 7.1.

create table public.bundle_items (
  bundle_product_id uuid not null references public.products (id) on delete cascade,
  child_product_id  uuid not null references public.products (id) on delete cascade,
  sort_order        integer not null default 0,

  primary key (bundle_product_id, child_product_id),
  constraint bundle_no_self_reference check (bundle_product_id <> child_product_id)
);

alter table public.bundle_items enable row level security;

-- Enforces that the parent really is a bundle and the child really is not.
-- Nested bundles are not supported in V1 and would break entitlement expansion.
create or replace function public.check_bundle_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  parent_type public.product_type;
  child_type  public.product_type;
begin
  select product_type into parent_type from public.products where id = new.bundle_product_id;
  select product_type into child_type  from public.products where id = new.child_product_id;

  if parent_type is distinct from 'bundle' then
    raise exception 'bundle_product_id must reference a product with product_type = bundle';
  end if;

  if child_type = 'bundle' then
    raise exception 'nested bundles are not supported';
  end if;

  return new;
end;
$$;

create trigger bundle_items_check_membership
  before insert or update on public.bundle_items
  for each row execute function public.check_bundle_membership();

-- --- Indexes -----------------------------------------------------------------

create index products_status_published_at_idx
  on public.products (status, published_at desc);

create index products_category_idx
  on public.products (category_id) where status = 'published';

create index products_type_idx
  on public.products (product_type) where status = 'published';

create index products_featured_idx
  on public.products (is_featured) where status = 'published';

create index products_search_idx
  on public.products using gin (search_vector);

create index product_offers_product_idx on public.product_offers (product_id);

-- At most one default offer per product.
create unique index product_offers_one_default_idx
  on public.product_offers (product_id) where is_default;

create index product_assets_product_idx
  on public.product_assets (product_id, sort_order);

create index bundle_items_bundle_idx on public.bundle_items (bundle_product_id);
create index bundle_items_child_idx  on public.bundle_items (child_product_id);

create index categories_sort_idx on public.categories (sort_order);

-- --- Row Level Security ------------------------------------------------------
-- Public reads are limited to published rows. Every write requires an admin.
-- Draft products must be invisible to anon and to ordinary signed-in users -
-- verify by querying as an anonymous client, not by checking the UI.

-- categories: fully readable, they carry nothing sensitive
create policy "categories_select_all" on public.categories
  for select to anon, authenticated using (true);

create policy "categories_admin_all" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- products
create policy "products_select_published" on public.products
  for select to anon, authenticated using (status = 'published');

create policy "products_admin_all" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- offers: only for a published product, and only while active
create policy "product_offers_select_published" on public.product_offers
  for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published'
    )
  );

create policy "product_offers_admin_all" on public.product_offers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- assets: PREVIEW ONLY.
-- Protected assets are never client-readable at all. The download route reads
-- them with the service-role client after an entitlement check, in Phase 6.
create policy "product_assets_select_preview" on public.product_assets
  for select to anon, authenticated
  using (
    is_preview
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published'
    )
  );

create policy "product_assets_admin_all" on public.product_assets
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- bundle items: readable when the bundle itself is published
create policy "bundle_items_select_published" on public.bundle_items
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.products p
      where p.id = bundle_product_id and p.status = 'published'
    )
  );

create policy "bundle_items_admin_all" on public.bundle_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
