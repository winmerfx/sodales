/**
 * Supabase types.
 *
 * The real file is GENERATED from the live schema, not written by hand:
 *
 *   npx supabase gen types typescript --project-id <your-project-ref> \
 *     > lib/supabase/types.ts
 *
 * That command needs the migrations to have been applied, which has not
 * happened yet — see PROJECT_STATUS.md. Until it runs, the hand-maintained row
 * types in lib/products/types.ts are the contract, and they are kept in step
 * with supabase/migrations/ by hand.
 *
 * Regenerate after EVERY migration and delete this note when you do.
 */

export type {
  Category,
  FulfillmentType,
  OfferKind,
  Product,
  ProductAsset,
  ProductOffer,
  ProductStatus,
  ProductType,
  ProductWithRelations,
} from "@/lib/products/types";
