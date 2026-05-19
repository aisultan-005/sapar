import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { setClerkTokenGetter } from "../../api/client";

/** Прокидывает Clerk session token в API-клиент для `Authorization: Bearer`. */
export default function ClerkApiTokenBridge() {
    const { isLoaded, getToken } = useAuth();

    useEffect(() => {
        if (!isLoaded) return undefined;
        setClerkTokenGetter(() =>
            getToken().catch(() => null)
        );
        return () => setClerkTokenGetter(null);
    }, [isLoaded, getToken]);

    return null;
}
