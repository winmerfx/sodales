import { z } from "zod";

/**
 * Admin input schemas.
 *
 * These mirror the CHECK constraints in supabase/migrations/0002_catalog.sql.
 * The database is the real enforcement — these exist so an admin gets a useful
 * message instead of a Postgres error string. If a constraint changes there, it
 * changes here in the same commit.
 */

const slug = z
  .string()
  .trim()
  .min(1, "Enter a slug")
  .max(120)
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    "Lowercase letters, numbers and single hyphens only",
  );

const optionalText = z
  .string()
  .trim()
  .max(20000)
  .optional()
  .transform((value) => (value ? value : null));

const optionalUrl = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .transform((value) => (value ? value : null))
  .refine(
    (value) => value === null || /^https?:\/\//.test(value),
    "Must start with http:// or https://",
  );

const uuidOrNull = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : null))
  .refine(
    (value) => value === null || z.string().uuid().safeParse(value).success,
    "Not a valid id",
  );

export const productTypeEnum = z.enum([
  "download",
  "template",
  "prompt_system",
  "workflow",
  "automation",
  "database",
  "course",
  "tool",
  "bundle",
  "external_access",
]);

export const productStatusEnum = z.enum(["draft", "published", "archived"]);

export const fulfillmentTypeEnum = z.enum([
  "file",
  "external_link",
  "protected_page",
  "video",
  "license_key",
  "tool_access",
  "subscription_access",
  "instructions",
]);

export const offerKindEnum = z.enum(["free", "one_time", "subscription"]);

export const productSchema = z.object({
  slug,
  name: z.string().trim().min(1, "Enter a name").max(200),
  tagline: optionalText,
  description: optionalText,
  product_type: productTypeEnum,
  status: productStatusEnum,
  category_id: uuidOrNull,
  cover_image_url: optionalUrl,
  is_featured: z.boolean().default(false),
  requirements: optionalText,
  license_terms: optionalText,
  seo_title: optionalText,
  seo_description: optionalText,
  og_image_url: optionalUrl,
});

export const categorySchema = z.object({
  slug,
  name: z.string().trim().min(1, "Enter a name").max(120),
  description: optionalText,
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

/**
 * Offer rules mirror the DB constraints: a free offer must cost nothing, a paid
 * offer must cost something, and a compare-at price must actually be higher or
 * it is not a discount.
 */
export const offerSchema = z
  .object({
    name: z.string().trim().min(1, "Enter an offer name").max(120),
    kind: offerKindEnum,
    price_cents: z.coerce
      .number()
      .int("Price must be a whole number of cents")
      .min(0, "Price cannot be negative")
      .max(99_999_999),
    compare_at_cents: z
      .union([z.coerce.number().int().min(0).max(99_999_999), z.literal("")])
      .optional()
      .transform((value) =>
        value === "" || value === undefined ? null : Number(value),
      ),
    currency: z.string().trim().length(3).toUpperCase().default("USD"),
    provider: optionalText,
    provider_variant_id: optionalText,
    is_default: z.boolean().default(false),
    is_active: z.boolean().default(true),
  })
  .refine((data) => data.kind !== "free" || data.price_cents === 0, {
    message: "A free offer must be priced at 0",
    path: ["price_cents"],
  })
  .refine((data) => data.kind === "free" || data.price_cents > 0, {
    message: "A paid offer must cost more than 0",
    path: ["price_cents"],
  })
  .refine(
    (data) =>
      data.compare_at_cents === null ||
      data.compare_at_cents > data.price_cents,
    {
      message: "Compare-at price must be higher than the price",
      path: ["compare_at_cents"],
    },
  );

/**
 * Asset rules mirror the assets_payload_matches_type CHECK. A 'file' asset with
 * no storage path is a broken download waiting to happen after someone pays.
 */
export const assetSchema = z
  .object({
    fulfillment_type: fulfillmentTypeEnum,
    title: z.string().trim().min(1, "Enter a title").max(200),
    description: optionalText,
    storage_path: optionalText,
    external_url: optionalUrl,
    body: optionalText,
    tool_slug: optionalText,
    is_preview: z.boolean().default(false),
    sort_order: z.coerce.number().int().min(0).max(9999).default(0),
  })
  .superRefine((data, ctx) => {
    const require = (
      field: "storage_path" | "external_url" | "body" | "tool_slug",
      message: string,
    ) => {
      if (!data[field]) {
        ctx.addIssue({ code: "custom", path: [field], message });
      }
    };

    switch (data.fulfillment_type) {
      case "file":
        require("storage_path", "A file asset needs a storage path");
        break;
      case "video":
        if (!data.storage_path && !data.external_url) {
          ctx.addIssue({
            code: "custom",
            path: ["storage_path"],
            message: "A video needs either a storage path or an external URL",
          });
        }
        break;
      case "external_link":
        require("external_url", "An external link asset needs a URL");
        break;
      case "protected_page":
      case "instructions":
        require("body", "This asset type needs body content");
        break;
      case "tool_access":
        require("tool_slug", "A tool asset needs a tool slug");
        break;
      default:
        break;
    }
  });
