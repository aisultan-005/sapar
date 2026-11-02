import { test } from "node:test";
import assert from "node:assert/strict";
import {
    parseDurationHours,
    nextSlot,
    computeSummary,
    countDays,
    groupByDay,
} from "../src/lib/route.js";
import { enrichItem, findLocation, routeDistanceKm } from "../src/lib/geo.js";
import { defaultItinerary } from "../src/data/locations.js";

test("parseDurationHours понимает разные форматы", () => {
    assert.equal(parseDurationHours("2ч"), 2);
    assert.equal(parseDurationHours("1.5ч"), 1.5);
    assert.equal(parseDurationHours("1,5 ч"), 1.5);
    assert.equal(parseDurationHours("30мин"), 0.5);
    assert.equal(parseDurationHours("1ч 30мин"), 1.5);
    assert.equal(parseDurationHours("2h"), 2);
    assert.equal(parseDurationHours("3 сағ"), 3);
    assert.equal(parseDurationHours("—"), 0);
    assert.equal(parseDurationHours(undefined), 0);
});

test("nextSlot: после последнего пункта + длительность + дорога, перенос на следующий день", () => {
    assert.deepEqual(nextSlot([]), { time: "09:00", day: 1 });
    assert.deepEqual(nextSlot([{ time: "10:00", duration: "2ч", day: 1 }]), { time: "12:30", day: 1 });
    assert.deepEqual(nextSlot([{ time: "19:00", duration: "—", day: 2 }]), { time: "20:30", day: 2 });
    assert.deepEqual(nextSlot([{ time: "20:00", duration: "2ч", day: 1 }]), { time: "09:00", day: 2 });
});

test("computeSummary по демо-маршруту считает реальное расстояние", () => {
    const s = computeSummary(defaultItinerary);
    assert.equal(s.measured, true);
    // Алматы → Чарын → Кольсай → лагерь: ~250 км по прямой × 1.3
    assert.ok(s.distanceKm > 250 && s.distanceKm < 450, String(s.distanceKm));
    assert.equal(s.hours, 8);
    assert.ok(s.budget > 0);
});

test("computeSummary без координат — оценка 40 км между остановками", () => {
    const s = computeSummary([{ title: "A" }, { title: "B" }, { title: "C" }]);
    assert.equal(s.measured, false);
    assert.equal(s.distanceKm, 80);
});

test("routeDistanceKm пропускает пункты без координат", () => {
    const { km, measured } = routeDistanceKm([{ coords: [43.2389, 76.8897] }, { title: "?" }]);
    assert.equal(measured, false);
    assert.equal(km, 0);
});

test("findLocation / enrichItem находят место по названию", () => {
    assert.equal(findLocation({ title: "Чарынский каньон" })?.id, 5);
    assert.equal(findLocation({ title: "Озеро Кольсайские озёра" })?.id, 6);
    assert.equal(findLocation({ title: "Обед" }), null);
    const it = enrichItem({ title: "Кольсайские озера", time: "10:00" });
    assert.deepEqual(it.coords, [42.7333, 78.3333]);
    assert.equal(it.locId, 6);
});

test("countDays и groupByDay", () => {
    const items = [{ day: 1 }, { day: 1 }, { day: 2 }, {}];
    assert.equal(countDays(items), 2);
    const groups = groupByDay(items);
    assert.deepEqual(groups.map((g) => g.day), [1, 2]);
    assert.deepEqual(groups[0].items.map((x) => x.index), [0, 1, 3]);
});
