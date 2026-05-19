import { useMemo } from "react";
import { useAuth } from "@clerk/react";
import { createSupabaseWithClerk, isSupabaseConfigured } from "../lib/supabase";

/** Supabase-клиент с RLS под токеном Clerk (шаблон JWT `supabase`). */
export function useSupabase() {
    const { getToken, isLoaded, userId } = useAuth();

    const supabase = useMemo(() => {
        if (!isLoaded || !userId || !isSupabaseConfigured()) return null;
        return createSupabaseWithClerk(getToken);
    }, [getToken, isLoaded, userId]);

    return { supabase, isReady: Boolean(supabase) };
}
