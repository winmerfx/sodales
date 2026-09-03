import "server-only";

import * as db from "@/lib/products/queries.db";
import * as seed from "@/lib/products/queries.seed";

/**
 * Catalog data source.
 *
 * ############################ TEMPORARY SCAFFOLDING ##########################
 *
 * This dispatcher exists for one reason: migrations 0002 and 0003 have not been
 * applied to Supabase yet, and the site is already live. Switching the queries
 * straight to Postgres would break the deployed storefront the moment it shipped.
 *
 * PRODUCTS_SOURCE=database  -> Postgres (queries.db.ts)
 * anything else / unset     -> seed data (queries.seed.ts)   [default]
 *
 * HOW TO REMOVE THIS FILE, once the migrations are applied and verified:
 *   1. Set PRODUCTS_SOURCE=database locally and confirm the storefront matches.
 *   2. Set it in Vercel and confirm the deployed site matches.
 *   3. Delete queries.seed.ts, lib/products/seed.ts and this dispatcher, then
 *      rename queries.db.ts to queries.ts.
 *   4. Drop PRODUCTS_SOURCE from .env.example and docs/ARCHITECTURE.md.
 *
 * Do not build anything new on top of the seed path. It is on its way out.
 * #############################################################################
 */

const useDatabase = process.env.PRODUCTS_SOURCE === "database";

const impl = useDatabase ? db : seed;

export const listCategories = impl.listCategories;
export const listProducts = impl.listProducts;
export const getProductBySlug = impl.getProductBySlug;
export const listFeaturedProducts = impl.listFeaturedProducts;
export const listProductsByType = impl.listProductsByType;
export const getLeadMagnet = impl.getLeadMagnet;
export const getRelatedProducts = impl.getRelatedProducts;
export const listProductSlugs = impl.listProductSlugs;

/** Which source is live. Surfaced in the admin overview so it is never a guess. */
export const productsSource: "database" | "seed" = useDatabase
  ? "database"
  : "seed";

export type { ProductFilters } from "@/lib/products/types";
