import { test } from "node:test";
import assert from "node:assert/strict";
import {
    resolveDays,
    sanitizePreferences,
    parseGroqRouteJson,
    normalizeItems,
    mockFromPreferences,
    buildPrompt,
} from "../src/services/aiRoute.service.js";

test("resolveDays: из days, из строки duration, ограничение 1…7", () => {
    assert.equal(resolveDays({ days: 3 }), 3);
    assert.equal(resolveDays({ duration: "2д" }), 2);
    assert.equal(resolveDays({ duration: "7д" }), 7);
    assert.equal(resolveDays({ days: 30 }), 7);
    assert.equal(resolveDays({ days: 0 }), 1);
    assert.equal(resolveDays({}), 1);
});

test("sanitizePreferences отбрасывает мусор", () => {
    const p = sanitizePreferences({ tags: ["Природа", 5, null], budget: "luxury", lang: "XX" });
    assert.deepEqual(p.tags, ["Природа"]);
    assert.equal(p.budget, "medium");
    assert.equal(p.lang, "РУС");
});

test("parseGroqRouteJson: JSON в markdown-блоке и с текстом вокруг", () => {
    const json = '{"title":"Тест","items":[{"day":1,"time":"09:00","title":"Чарынский каньон","icon":"nature"}]}';
    for (const text of [json, "```json\n" + json + "\n```", "Вот маршрут:\n" + json + "\nУдачи!"]) {
        const r = parseGroqRouteJson(text, 1);
        assert.ok(r, text);
        assert.equal(r.title, "Тест");
        assert.equal(r.items.length, 1);
    }
    assert.equal(parseGroqRouteJson("не json", 1), null);
    assert.equal(parseGroqRouteJson('{"title":"x","items":[]}', 1), null);
});

test("normalizeItems: координаты из каталога, валидация модели, дни не убывают", () => {
    const items = normalizeItems(
        [
            { day: 1, time: "9:00", title: "Чарынский каньон", icon: "nature" },
            { day: 1, time: "25:99", title: "Кафе", icon: "bar", lat: 43.3, lon: 79.1 },
            { day: 3, title: "Где-то", lat: 10, lon: 10 }, // вне Казахстана → без координат
            { day: 1, title: "Кольсайские озёра" },         // день меньше предыдущего → поднимается
        ],
        2
    );
    assert.equal(items[0].time, "09:00");
    assert.equal(items[0].locId, 5);
    assert.deepEqual(items[0].coords, [43.355, 79.075]);
    assert.equal(items[1].icon, "nature");
    assert.match(items[1].time, /^\d\d:\d\d$/);
    assert.deepEqual(items[1].coords, [43.3, 79.1]);
    assert.equal(items[2].day, 2); // ограничено числом дней
    assert.equal(items[2].coords, undefined);
    assert.equal(items[3].day, 2);
    assert.equal(items[3].locId, 6);
});

test("mockFromPreferences: нужное число дней, у всех пунктов есть координаты", () => {
    for (const days of [1, 2, 3, 7]) {
        const r = mockFromPreferences({ tags: ["Природа"], days, lang: "РУС" });
        const maxDay = Math.max(...r.items.map((it) => it.day));
        assert.equal(maxDay, days);
        assert.ok(r.items.every((it) => Array.isArray(it.coords)));
        // в многодневном маршруте все дни, кроме последнего, заканчиваются ночёвкой
        for (let d = 1; d < days; d++) {
            const dayItems = r.items.filter((it) => it.day === d);
            assert.equal(dayItems.at(-1).icon, "stay");
        }
    }
});

test("mockFromPreferences учитывает язык", () => {
    const r = mockFromPreferences({ tags: ["Природа"], days: 2, lang: "ENG" });
    assert.match(r.title, /Nature: 2 days/);
    assert.equal(r.items[0].title, "Breakfast");
});

test("buildPrompt содержит число дней, язык и каталог", () => {
    const prompt = buildPrompt(sanitizePreferences({ days: 3, lang: "ҚАЗ" }));
    assert.match(prompt, /3 дней/);
    assert.match(prompt, /казахский/);
    assert.match(prompt, /Чарынский каньон/);
});

test("mockFromPreferences: места по интересам идут раньше остальных", () => {
    const r = mockFromPreferences({ tags: ["История"], days: 2, lang: "РУС" });
    const places = r.items.filter((it) => it.locId).map((it) => it.title);
    assert.deepEqual(places.slice(0, 3).sort(), ["Байконур", "Тараз", "Туркестан"]);
});
