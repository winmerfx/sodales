import { z } from "zod";

/**
 * Environment validation.
 *
 * A missing or malformed variable fails loudly at startup rather than
 * surfacing later as a confusing runtime error. See docs/ARCHITECTURE.md
 * section 12 for what each variable does and whether it is safe to expose.
 *
 * NEXT_PUBLIC_* is compiled into the browser bundle and visible to anyone.
 * Everything else must stay server-side.
 *
 * Escape hatch: SKIP_ENV_VALIDATION=1 substitutes placeholders so lint,
 * typecheck or a CI build can run with no secrets present. The app cannot
 * reach Supabase in that mode. Never set it for a real deployment.
 */

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

type ClientEnv = z.infer<typeof clientSchema>;
type ServerEnv = z.infer<typeof serverSchema>;

/**
 * Next.js inlines process.env.NEXT_PUBLIC_* at build time only when accessed
 * as a static property path, so these cannot be read dynamically.
 */
const clientEnvRaw = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

const skipValidation = process.env.SKIP_ENV_VALIDATION === "1";

function fail(scope: string, error: z.ZodError): never {
  const detail = error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");

  throw new Error(
    `Invalid ${scope} environment variables:\n${detail}\n\n` +
      `Copy .env.example to .env.local and fill in the values. ` +
      `docs/ROADMAP.md (Phase 1) says where to find each one.`,
  );
}

function parseClientEnv(): ClientEnv {
  const parsed = clientSchema.safeParse(clientEnvRaw);
  if (parsed.success) return parsed.data;

  if (skipValidation) {
    console.warn(
      "[env] SKIP_ENV_VALIDATION=1 — using placeholder values. " +
        "Supabase calls will not work. Never use this for a real deployment.",
    );
    return {
      NEXT_PUBLIC_SITE_URL:
        clientEnvRaw.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      NEXT_PUBLIC_SUPABASE_URL:
        clientEnvRaw.NEXT_PUBLIC_SUPABASE_URL ??
        "https://placeholder.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        clientEnvRaw.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key",
    };
  }

  fail("client", parsed.error);
}

export const clientEnv = parseClientEnv();

/**
 * Server-only variables, read lazily so that importing this module from a
 * build step does not require secrets to be present.
 */
export function getServerEnv(): ServerEnv {
  const parsed = serverSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  if (parsed.success) return parsed.data;

  if (skipValidation) {
    return { SUPABASE_SERVICE_ROLE_KEY: "placeholder-service-role-key" };
  }

  fail("server", parsed.error);
}
