import { api } from "./client";

export const itineraryApi = {
    generate: (preferences) =>
        api.post("/ai/route", { preferences }),

    save: (itinerary) =>
        api.post("/itinerary", itinerary),

    getById: (id) =>
        api.get(`/itinerary/${id}`),
};
