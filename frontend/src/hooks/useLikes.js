import { useEffect, useState } from "react";

const KEY = "sapar_likes";

function readStored() {
    try {
        const raw = localStorage.getItem(KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return new Set(Array.isArray(arr) ? arr : []);
    } catch {
        return new Set();
    }
}

export const useLikes = () => {
    const [likedIds, setLikedIds] = useState(readStored);

    useEffect(() => {
        try {
            localStorage.setItem(KEY, JSON.stringify([...likedIds]));
        } catch {
            /* приватный режим — игнорируем */
        }
    }, [likedIds]);

    const toggleLike = (id) => {
        setLikedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return { likedIds, toggleLike };
};
