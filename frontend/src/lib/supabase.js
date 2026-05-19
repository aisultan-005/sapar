import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL || "";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export function isSupabaseConfigured() {
    return Boolean(url && anonKey);
}

/**
 * Клиент Supabase с JWT из Clerk (JWT template в дашборде Clerk должен называться `supabase`).
 * @see https://clerk.com/docs/guides/development/integrations/databases/supabase
 */
export function createSupabaseWithClerk(getToken) {
    if (!isSupabaseConfigured()) return null;
    return createClient(url, anonKey, {
        accessToken: async () => {
            try {
                const token = await getToken({ template: "supabase" });
                return token ?? null;
            } catch {
                return null;
            }
        },
    });
}
