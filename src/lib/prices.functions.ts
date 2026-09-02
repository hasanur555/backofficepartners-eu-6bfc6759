import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { DEFAULT_PRICES, type PriceMap } from "./prices";

/** Public read of the live price list (anon SELECT policy). Falls back to defaults on failure. */
export const getSitePrices = createServerFn({ method: "GET" }).handler(async (): Promise<PriceMap> => {
  try {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return DEFAULT_PRICES;

    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data, error } = await client.from("site_prices").select("id, amount");
    if (error || !data) return DEFAULT_PRICES;

    const map: PriceMap = { ...DEFAULT_PRICES };
    for (const row of data) map[row.id] = Number(row.amount);
    return map;
  } catch {
    return DEFAULT_PRICES;
  }
});
