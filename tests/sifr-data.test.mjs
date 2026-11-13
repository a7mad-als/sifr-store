import test from "node:test";
import assert from "node:assert/strict";
import { books } from "../lib/sifr-data/src/catalogue.ts";
import { taxonomy } from "../lib/sifr-data/src/taxonomy.ts";
import { destinations, shippingFor, partnerTracks, storeSettings, currencyOptions, estimateShipping, shippingZones } from "../lib/sifr-data/src/settings.ts";

test("all catalogue classifications belong to the hierarchical taxonomy", () => {
  assert.equal(taxonomy.length, 9);
  for (const book of books) {
    const main = taxonomy.find(category => category.id === book.category);
    assert.ok(main, `Unknown parent for ${book.id}`);
    assert.ok(!book.subcategory || main.children.some(child => child.id === book.subcategory), `Unknown child for ${book.id}`);
  }
  for (const category of taxonomy) {
    assert.ok(category.name.ar && category.name.en);
    assert.equal(new Set(category.children.map(c => c.id)).size, category.children.length);
  }
});

test("destination configuration includes all Arab League states and requested regions", () => {
  const codes = destinations.map(item => item.code);
  for (const code of ["KW","SA","AE","QA","BH","OM","SY","JO","LB","IQ","PS","YE","EG","SD","LY","TN","DZ","MA","MR","SO","DJ","KM","TR","RU","RU-DA","RU-CE"]) {
    assert.ok(codes.includes(code), `Missing destination ${code}`);
  }
  assert.equal(new Set(codes).size, 26);
  assert.equal(shippingFor("KW"), 5);
  assert.equal(shippingFor("SA"), 5);
  assert.equal(shippingFor("RU-CE"), 12);
  assert.equal(shippingFor("FR"), 15);
  assert.throws(() => shippingFor("!!"), /Unsupported/);
  assert.equal(shippingZones.length, 7);
  assert.deepEqual(estimateShipping("KW", 1.1), {
    amountKwd: 6.5, zone: "gulf", minDays: 3, maxDays: 7, weightKg: 1.1,
  });
  assert.ok(currencyOptions.some(item => item.code === "SAR"));
  assert.ok(currencyOptions.some(item => item.code === "RUB"));
  assert.ok(books.every(book => book.weightKg === 0.5));
});

test("temporary social and contact settings cannot masquerade as active links", () => {
  assert.equal(partnerTracks.length, 6);
  assert.equal(storeSettings.socials.length, 6);
  assert.ok(storeSettings.socials.every(s => s.url === null));
  assert.ok(Object.values(storeSettings.contact).every(s => s.placeholder && s.url === null));
  assert.equal(storeSettings.newsletter.deliveryConnected, false);
  assert.match(storeSettings.partnershipResponse.ar, /بعد تفعيل البريد/);
  assert.match(storeSettings.partnershipResponse.en, /once email is enabled/);
});
