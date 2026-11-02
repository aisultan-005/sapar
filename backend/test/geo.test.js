import { test } from "node:test";
import assert from "node:assert/strict";
import { haversineKm, sortByDistance, isValidCoords } from "../src/services/geo.service.js";

test("haversineKm: Алматы → Астана ≈ 970 км", () => {
    const km = haversineKm([43.2389, 76.8897], [51.1605, 71.4704]);
    assert.ok(km > 950 && km < 990, String(km));
});

test("haversineKm принимает и массив, и объект {lat, lon}", () => {
    const a = haversineKm([43.2389, 76.8897], { lat: 43.355, lon: 79.075 });
    const b = haversineKm({ lat: 43.2389, lon: 76.8897 }, [43.355, 79.075]);
    assert.equal(a, b);
});

test("sortByDistance: ближние первыми, без координат — в конце", () => {
    const places = [
        { name: "Астана", coords: [51.1605, 71.4704] },
        { name: "Без координат" },
        { name: "Медеу", coords: [43.1581, 77.0581] },
    ];
    const sorted = sortByDistance(places, 43.2389, 76.8897);
    assert.deepEqual(sorted.map((p) => p.name), ["Медеу", "Астана", "Без координат"]);
    assert.match(sorted[0].dist, /км$/);
});

test("isValidCoords отсекает точки вне Казахстана", () => {
    assert.ok(isValidCoords([43.2, 76.9]));
    assert.ok(!isValidCoords([10, 10]));
    assert.ok(!isValidCoords([NaN, 76]));
    assert.ok(!isValidCoords(null));
});
