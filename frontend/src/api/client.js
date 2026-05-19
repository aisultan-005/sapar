const BASE_URL =
    import.meta.env.VITE_API_URL?.trim() ||
    (import.meta.env.DEV ? "/api" : "");

let clerkTokenGetter = null;

/** Вызывается из ClerkApiTokenBridge после загрузки Clerk. */
export function setClerkTokenGetter(fn) {
    clerkTokenGetter = typeof fn === "function" ? fn : null;
}

async function buildHeaders(extra = {}) {
    const headers = { "Content-Type": "application/json", ...extra };
    if (!clerkTokenGetter) return headers;
    try {
        const token = await clerkTokenGetter();
        if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
        /* без сессии */
    }
    return headers;
}

const request = async (endpoint, options = {}) => {
    const headers = await buildHeaders(options.headers);
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
};

export const api = {
    get:  (url)        => request(url),
    post: (url, body)  => request(url, { method: "POST", body: JSON.stringify(body) }),
};
