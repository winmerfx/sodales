-- =============================================================================
-- Placeholder catalog seed
--
-- DATA, NOT SCHEMA. Deliberately kept out of supabase/migrations/ so it never
-- runs automatically against production.
--
-- Mirrors lib/products/seed.ts exactly, so switching PRODUCTS_SOURCE=database
-- produces the same storefront rather than an empty one.
--
-- These are the development placeholders from the brief, NOT the real launch
-- catalog — that is still an open decision in PROJECT_STATUS.md.
--
-- Safe to re-run: every insert is ON CONFLICT DO NOTHING, keyed on slug.
-- Run AFTER 0002_catalog.sql.
-- =============================================================================

-- --- Categories --------------------------------------------------------------

insert into public.categories (slug, name, description, sort_order) values
  ('ai-tools',       'AI Tools',       'Hosted tools that stay in your library and improve over time.', 1),
  ('automation',     'Automation',     'Systems that run the job end to end without supervision.',      2),
  ('workflows',      'Workflows',      'Importable n8n workflows, documented and ready to run.',        3),
  ('prompt-systems', 'Prompt Systems', 'Structured prompt sets with the reasoning written down.',       4),
  ('templates',      'Templates',      'Reusable structures you can ship from on day one.',             5)
on conflict (slug) do nothing;

-- --- Products ----------------------------------------------------------------

insert into public.products
  (slug, name, tagline, description, product_type, status, category_id,
   is_featured, requirements, license_terms, published_at)
values
  (
    'brief-composer',
    'Brief Composer',
    'Turn a messy client call into a scoped brief in under a minute.',
    'Paste raw notes from a discovery call and get back a structured brief: objective, constraints, deliverables, out-of-scope, open questions and a first-pass timeline. Built for people who lose an hour after every call turning notes into something a team can act on.',
    'tool', 'published',
    (select id from public.categories where slug = 'ai-tools'),
    true,
    'A SODALES account. No API key of your own required — generations run on your plan''s included quota.',
    'Single-operator commercial license. Use it in your own business and for client work. Do not resell or redistribute the files themselves.',
    '2026-08-20T00:00:00Z'
  ),
  (
    'client-onboarding-engine',
    'Client Onboarding Engine',
    'Signed contract to kicked-off project without anyone touching a keyboard.',
    'A complete onboarding system: contract signature triggers folder creation, task templates, a welcome sequence, an intake form, and a kickoff call booking. Ships as connected n8n workflows plus the document templates they depend on.',
    'automation', 'published',
    (select id from public.categories where slug = 'automation'),
    true,
    'A self-hosted or cloud n8n instance, and accounts for the tools you connect. Setup takes roughly 90 minutes following the included guide.',
    'Single-operator commercial license. Use it in your own business and for client work. Do not resell or redistribute the files themselves.',
    '2026-08-14T00:00:00Z'
  ),
  (
    'lead-enrichment-pipeline',
    'Lead Enrichment Pipeline',
    'Every inbound lead researched, scored and routed before you read it.',
    'An n8n workflow that takes a raw form submission, enriches it from public sources, scores it against your ideal-customer criteria, and routes it to the right place with a short written summary of who they are and why they matter.',
    'workflow', 'published',
    (select id from public.categories where slug = 'workflows'),
    true,
    'n8n 1.x, and an enrichment provider account. The workflow ships with the provider abstracted so you can swap it.',
    'Single-operator commercial license. Use it in your own business and for client work. Do not resell or redistribute the files themselves.',
    '2026-08-08T00:00:00Z'
  ),
  (
    'positioning-prompt-system',
    'Positioning Prompt System',
    'Find the sentence that makes the right buyer stop scrolling.',
    'Fourteen chained prompts that move from customer research to a defensible positioning statement, with the reasoning behind each step written out so you can adapt rather than copy. Includes worked examples for a service business, a SaaS product and a digital product store.',
    'prompt_system', 'published',
    (select id from public.categories where slug = 'prompt-systems'),
    false,
    'Any capable chat model. Tested on current frontier models.',
    'Single-operator commercial license. Use it in your own business and for client work. Do not resell or redistribute the files themselves.',
    '2026-07-30T00:00:00Z'
  ),
  (
    'offer-page-template-kit',
    'Offer Page Template Kit',
    'A sales page structure that survives contact with a real buyer.',
    'Six offer-page layouts with the copy structure annotated section by section: what each block is for, what to write, and the failure mode it prevents. Supplied as editable documents plus a plain-text outline you can hand to a writer.',
    'template', 'published',
    (select id from public.categories where slug = 'templates'),
    false,
    'None.',
    'Single-operator commercial license. Use it in your own business and for client work. Do not resell or redistribute the files themselves.',
    '2026-07-22T00:00:00Z'
  ),
  (
    'operator-bundle',
    'The Operator Bundle',
    'The four systems that remove the most manual work, together.',
    'Brief Composer, the Client Onboarding Engine, the Lead Enrichment Pipeline and the Positioning Prompt System — bought together. Everything a small team needs to stop doing the same three hours of admin every week.',
    'bundle', 'published',
    (select id from public.categories where slug = 'automation'),
    true,
    'See each included product. The bundle is worth it only if you run, or plan to run, n8n.',
    'Single-operator commercial license. Use it in your own business and for client work. Do not resell or redistribute the files themselves.',
    '2026-08-20T00:00:00Z'
  ),
  (
    'automation-audit-checklist',
    'The Automation Audit',
    'Find the three tasks in your week worth automating first. Free.',
    'A 12-page worksheet for auditing where your time actually goes and which tasks repay automation soonest. Deliberately opinionated: it will tell you when a task is not worth automating, which is most of them.',
    'download', 'published',
    (select id from public.categories where slug = 'automation'),
    false,
    'None. Bring one week of honest time tracking.',
    'Free to use personally and commercially. Do not resell or redistribute.',
    '2026-07-15T00:00:00Z'
  )
on conflict (slug) do nothing;

-- --- Offers ------------------------------------------------------------------

insert into public.product_offers
  (product_id, name, kind, price_cents, compare_at_cents, currency, is_default, is_active)
select p.id, v.name, v.kind::public.offer_kind, v.price_cents, v.compare_at_cents, 'USD', true, true
from (values
  ('brief-composer',             'Standard license', 'one_time',  4900,  null::int),
  ('client-onboarding-engine',   'Standard license', 'one_time', 14900,  null),
  ('lead-enrichment-pipeline',   'Standard license', 'one_time',  8900,  null),
  ('positioning-prompt-system',  'Standard license', 'one_time',  3900,  null),
  ('offer-page-template-kit',    'Standard license', 'one_time',  2900,  null),
  ('operator-bundle',            'Bundle license',   'one_time', 19900,  32600),
  ('automation-audit-checklist', 'Free download',    'free',         0,  null)
) as v(slug, name, kind, price_cents, compare_at_cents)
join public.products p on p.slug = v.slug
where not exists (
  select 1 from public.product_offers o where o.product_id = p.id
);

-- --- Assets ------------------------------------------------------------------

insert into public.product_assets
  (product_id, fulfillment_type, title, description, storage_path, tool_slug,
   body, file_size_bytes, sort_order)
select
  p.id,
  v.fulfillment_type::public.fulfillment_type,
  v.title,
  v.description,
  v.storage_path,
  v.tool_slug,
  v.body,
  v.file_size_bytes,
  v.sort_order
from (values
  ('brief-composer', 'tool_access', 'Open Brief Composer',
   'Runs in your dashboard. Counts against your plan''s quota.',
   null::text, 'brief-composer'::text, null::text, null::bigint, 1),
  ('client-onboarding-engine', 'file', 'n8n workflow files (6)',
   'Import-ready JSON for each stage of the onboarding sequence.',
   'onboarding-engine/workflows.zip', null, null, 184320, 1),
  ('client-onboarding-engine', 'instructions', 'Setup guide',
   'Credentials, environment variables and the order to import in.',
   null, null, 'Placeholder setup guide. Replace before launch.', null, 2),
  ('lead-enrichment-pipeline', 'file', 'Workflow JSON',
   'Single import, provider credentials abstracted into variables.',
   'lead-enrichment/workflow.json', null, null, 42130, 1),
  ('positioning-prompt-system', 'protected_page', 'The prompt system',
   'All fourteen prompts with commentary, readable in your library.',
   null, null, 'Placeholder prompt content. Replace before launch.', null, 1),
  ('offer-page-template-kit', 'file', 'Template pack',
   'Six layouts as editable documents plus plain-text outlines.',
   'offer-page-kit/templates.zip', null, null, 2310000, 1),
  ('automation-audit-checklist', 'file', 'The Automation Audit (PDF)',
   '12 pages, printable.',
   'automation-audit/audit.pdf', null, null, 940000, 1)
) as v(slug, fulfillment_type, title, description, storage_path, tool_slug, body, file_size_bytes, sort_order)
join public.products p on p.slug = v.slug
where not exists (
  select 1 from public.product_assets a
  where a.product_id = p.id and a.title = v.title
);

-- --- Bundle membership -------------------------------------------------------

insert into public.bundle_items (bundle_product_id, child_product_id, sort_order)
select b.id, c.id, v.sort_order
from (values
  ('brief-composer', 1),
  ('client-onboarding-engine', 2),
  ('lead-enrichment-pipeline', 3),
  ('positioning-prompt-system', 4)
) as v(child_slug, sort_order)
join public.products c on c.slug = v.child_slug
cross join (select id from public.products where slug = 'operator-bundle') b
on conflict (bundle_product_id, child_product_id) do nothing;
