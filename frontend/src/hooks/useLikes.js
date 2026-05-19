import { useState } from "react";

export const useLikes = () => {
    const [likedIds, setLikedIds] = useState(new Set());

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
