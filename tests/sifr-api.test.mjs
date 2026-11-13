import test from "node:test";
import assert from "node:assert/strict";

const base = "http://localhost:80/api";
async function post(path, data) {
  const response = await fetch(`${base}${path}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
  });
  return { status: response.status, body: await response.json() };
}
const delivery = {
  name: "Automated Demo Test", email: "test@example.test", phone: "00000000",
  country: "KW", city: "Test city", address: "Test address, no dispatch", paymentMethod: "knet",
  items: [{ bookId: 13, quantity: 1 }],
};

test("catalogue has all requested collections and stable, unique identifiers", async () => {
  const response = await fetch(`${base}/books`);
  assert.equal(response.status, 200);
  const books = await response.json();
  assert.equal(books.length, 36);
  assert.equal(new Set(books.map(b => b.id)).size, 36);
  assert.ok(!books.some(b => b.id === 11 || b.title.en === "The Sealed Nectar"));
  const special = books.find(b => b.id === 13);
  assert.equal(special.title.ar, "تعليق المصابيح");
  assert.equal(special.author.ar, "يُحدَّد لاحقًا");
  assert.equal(special.publisher.ar, "يُحدَّد لاحقًا");
  assert.equal(special.featured, true);
  assert.match(special.volumeLabel.en, /Multi-volume/);
  const siraj = books.filter(b => b.author.en.includes("Siraj al-Din"));
  assert.equal(siraj.length, 14);
  assert.ok(siraj.every(b => b.publisher.en === "To be determined"));
  assert.equal(books.filter(b => b.publisher.en === "Dar al-Minhaj").length, 7);
  assert.equal(books.find(b => b.title.ar === "إحياء علوم الدين").volumes, 10);
  assert.equal(books.filter(b => b.publisher.en === "Dar al-Taqwa" && b.isDemo).length, 4);
  for (const book of books) {
    assert.ok(book.publisher.ar && book.publisher.en && book.author.ar && book.author.en);
    assert.equal(typeof book.price, "number");
    assert.ok(["quran", "hadith", "seerah", "aqeedah", "fiqh", "tazkiyah", "language", "rational", "history"].includes(book.category));
  }
});

test("demo checkout accepts expanded destinations and computes authoritative totals", async () => {
  for (const [country, shipping, zone] of [["KW", 5, "gulf"], ["SY", 8, "levantEgypt"], ["PS", 8, "levantEgypt"], ["TR", 9, "turkey"], ["RU-DA", 12, "russiaCaucasus"], ["RU-CE", 12, "russiaCaucasus"]]) {
    const result = await post("/orders", { ...delivery, country, price: 0 });
    assert.equal(result.status, 201, JSON.stringify(result));
    assert.equal(result.body.subtotal, 45);
    assert.equal(result.body.shipping, shipping);
    assert.equal(result.body.total, 45 + shipping);
    assert.equal(result.body.shippingEstimate.zone, zone);
    assert.equal(result.body.shippingEstimate.weightKg, 0.5);
    assert.equal(result.body.demo, true);
    assert.match(result.body.orderNumber, /^SIFR-/);
  }
  const heavier = await post("/orders", {
    ...delivery, country: "RU", items: [{ bookId: 13, quantity: 3 }],
  });
  assert.equal(heavier.status, 201);
  assert.equal(heavier.body.shippingEstimate.weightKg, 1.5);
  assert.equal(heavier.body.shipping, 15);
});

test("checkout rejects retired books and unsupported destinations", async () => {
  assert.equal((await post("/orders", { ...delivery, items: [{ bookId: 11, quantity: 1 }] })).status, 400);
  assert.equal((await post("/orders", { ...delivery, country: "!!" })).status, 400);
});

test("country and exchange endpoints return the live global market data", async () => {
  const [countryResponse, rateResponse] = await Promise.all([
    fetch(`${base}/countries`), fetch(`${base}/exchange-rates`),
  ]);
  assert.equal(countryResponse.status, 200);
  const countryData = await countryResponse.json();
  assert.ok(countryData.countries.length >= 200);
  assert.ok(countryData.countries.find(country => country.code === "KW")?.callingCode === "+965");
  assert.ok(countryData.countries.find(country => country.code === "FR"));
  assert.ok(countryData.countries.find(country => country.code === "RU-DA"));
  assert.equal(rateResponse.status, 200);
  const rateData = await rateResponse.json();
  assert.equal(rateData.base, "KWD");
  assert.ok(rateData.rates.SAR > 0);
  assert.ok(rateData.rates.USD > 0);
});

test("all six partnership types work without a quantity or institutional email", async () => {
  for (const entityType of ["bookshop", "publisher", "education", "charity", "research", "distributor"]) {
    const result = await post("/quotes", {
      entityType, name: "Automated Partner", country: "SY", contactMethod: "whatsapp",
      contact: "+0000000000", cooperation: "Distribution", message: "Automated test, no external contact.",
    });
    assert.equal(result.status, 201, JSON.stringify(result));
    assert.match(result.body.reference, /^PARTNER-/);
  }
});

test("partnership rejects invalid contact and saves newsletter only for valid email", async () => {
  const bad = await post("/quotes", {
    entityType: "publisher", name: "Automated Partner", country: "TR", contactMethod: "email",
    contact: "not-an-email", cooperation: "Distribution", message: "Automated test",
  });
  assert.equal(bad.status, 400);
  assert.equal((await post("/newsletter", { email: "not-an-email", language: "ar" })).status, 400);
  const valid = await post("/newsletter", { email: "test@example.test", language: "en" });
  assert.equal(valid.status, 201);
  assert.match(valid.body.reference, /^NEWS-/);
});
