import { api } from "./client";

export const locationsApi = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return api.get(`/locations${query ? `?${query}` : ""}`);
    },

    getById: (id) => api.get(`/locations/${id}`),

    getNearby: (lat, lon) =>
        api.get(`/locations/nearby?lat=${lat}&lon=${lon}`),
};
