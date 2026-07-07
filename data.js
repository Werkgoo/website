/* Motions Occasions — data-laag
   Voorraad wordt bewaard in localStorage (sleutel: mo_cars).
   Bij eerste bezoek wordt de demo-voorraad hieronder geladen;
   daarna is het beheerscherm (/admin) de bron van waarheid. */

const MO_STORE_KEY = "mo_cars";

const MO_SEED = [
  {
    id: "vw-golf-2019",
    kenteken: "XK-880-J",
    merk: "Volkswagen", model: "Golf", uitvoering: "1.5 TSI Highline",
    prijs: 18950, bouwjaar: 2019, km: 78500,
    brandstof: "Benzine", transmissie: "Handgeschakeld", kleur: "Blauw metallic",
    deuren: 5, zitplaatsen: 5, vermogen: "150 pk (110 kW)", apk: "2027-03-14",
    opties: ["Adaptieve cruisecontrol", "Navigatie", "Apple CarPlay / Android Auto", "Stoelverwarming", "LED-koplampen", "Parkeersensoren v+a"],
    omschrijving: "Zeer nette Golf Highline uit 2019 met volledige onderhoudshistorie. Eerste eigenaar, altijd bij de dealer onderhouden. Rijklaar afgeleverd met nieuwe APK en beurt.",
    fotos: ["/fotos/vw-golf-2019.png"], status: "te-koop", createdAt: "2026-06-01"
  },
  {
    id: "bmw-3-2018",
    kenteken: "TP-456-D",
    merk: "BMW", model: "3-serie", uitvoering: "320i High Executive",
    prijs: 24750, bouwjaar: 2018, km: 96200,
    brandstof: "Benzine", transmissie: "Automaat", kleur: "Blauw metallic",
    deuren: 4, zitplaatsen: 5, vermogen: "184 pk (135 kW)", apk: "2026-11-02",
    opties: ["Leder interieur", "Head-up display", "Harman Kardon audio", "Elektrische achterklep", "Sportstoelen", "Keyless entry"],
    omschrijving: "Prachtige 320i High Executive in nieuwstaat. Dealeronderhouden, tweede eigenaar. Complete uitvoering met o.a. head-up display en Harman Kardon geluidssysteem.",
    fotos: ["/fotos/bmw-3-2018.png"], status: "te-koop", createdAt: "2026-06-08"
  },
  {
    id: "audi-a3-2020",
    kenteken: "GH-221-N",
    merk: "Audi", model: "A3 Sportback", uitvoering: "35 TFSI S edition",
    prijs: 27900, bouwjaar: 2020, km: 54300,
    brandstof: "Benzine", transmissie: "Automaat", kleur: "Wit",
    deuren: 5, zitplaatsen: 5, vermogen: "150 pk (110 kW)", apk: "2027-01-20",
    opties: ["Virtual cockpit", "S-line exterieur", "Matrix LED", "Draadloos laden", "Achteruitrijcamera", "18\" lichtmetaal"],
    omschrijving: "Sportieve A3 Sportback S edition met de gewilde 35 TFSI-motor. NAP-gecontroleerd, schadevrij en in absolute topstaat.",
    fotos: ["/fotos/audi-a3-2020.png"], status: "te-koop", createdAt: "2026-06-12"
  },
  {
    id: "toyota-yaris-2021",
    kenteken: "RS-903-K",
    merk: "Toyota", model: "Yaris", uitvoering: "1.5 Hybrid Dynamic",
    prijs: 19450, bouwjaar: 2021, km: 41800,
    brandstof: "Hybride", transmissie: "Automaat", kleur: "Wit",
    deuren: 5, zitplaatsen: 5, vermogen: "116 pk (85 kW)", apk: "2027-05-30",
    opties: ["Toyota Safety Sense", "Climate control", "Achteruitrijcamera", "Smart entry", "Lane assist", "DAB+ radio"],
    omschrijving: "Zuinige Yaris Hybrid met fabrieksgarantie tot 2031 (bij onderhoud). Ideale stadsauto: 1 op 25 en wegenbelasting-vriendelijk.",
    fotos: ["/fotos/toyota-yaris-2021.png"], status: "te-koop", createdAt: "2026-06-15"
  },
  {
    id: "mercedes-a-2019",
    kenteken: "XN-777-B",
    merk: "Mercedes-Benz", model: "A-klasse", uitvoering: "A180 Business Solution AMG",
    prijs: 26500, bouwjaar: 2019, km: 68900,
    brandstof: "Benzine", transmissie: "Automaat", kleur: "Grijs",
    deuren: 5, zitplaatsen: 5, vermogen: "136 pk (100 kW)", apk: "2026-12-18",
    opties: ["AMG-styling", "MBUX widescreen", "Sfeerverlichting", "Stoelverwarming", "Camera", "Cruise control"],
    omschrijving: "Sportief uitgevoerde A-klasse met AMG-pakket en het indrukwekkende MBUX-systeem. Perfect onderhouden en zichtbaar goed verzorgd.",
    fotos: ["/fotos/mercedes-a-2019.png"], status: "gereserveerd", createdAt: "2026-06-18"
  },
  {
    id: "kia-picanto-2022",
    kenteken: "PZ-104-T",
    merk: "Kia", model: "Picanto", uitvoering: "1.0 DPi DynamicLine",
    prijs: 13950, bouwjaar: 2022, km: 22400,
    brandstof: "Benzine", transmissie: "Handgeschakeld", kleur: "Wit",
    deuren: 5, zitplaatsen: 4, vermogen: "67 pk (49 kW)", apk: "2027-08-09",
    opties: ["Fabrieksgarantie t/m 2029", "Airco", "Apple CarPlay", "Achteruitrijcamera", "Bluetooth", "LED-dagrijverlichting"],
    omschrijving: "Jonge Picanto met nog ruim 3 jaar fabrieksgarantie. Lage kilometerstand, eerste eigenaar en compleet onderhouden. Instapklaar!",
    fotos: ["/fotos/kia-picanto-2022.png"], status: "te-koop", createdAt: "2026-06-22"
  }
];

/* ---------- opslag ---------- */
const MO_SEED_VERSION = "2";

function moLoadCars() {
  try {
    const raw = localStorage.getItem(MO_STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* privémodus of corrupte data → val terug op seed */ }
  return MO_SEED.slice();
}
function moSaveCars(cars) {
  localStorage.setItem(MO_STORE_KEY, JSON.stringify(cars));
}
function moInitStore() {
  try {
    if (!localStorage.getItem(MO_STORE_KEY)) {
      moSaveCars(MO_SEED);
    } else if (localStorage.getItem("mo_seed_v") !== MO_SEED_VERSION) {
      // demo-voorraad is vernieuwd: ververs de demo-auto's, laat eigen auto's staan
      const seedIds = MO_SEED.map(s => s.id);
      const eigen = moLoadCars().filter(c => !seedIds.includes(c.id));
      moSaveCars(MO_SEED.concat(eigen));
    }
    localStorage.setItem("mo_seed_v", MO_SEED_VERSION);
  } catch (e) { /* opslag niet beschikbaar */ }
}
function moGetCar(id) {
  return moLoadCars().find(c => c.id === id) || null;
}

/* ---------- helpers ---------- */
function moEuro(n) {
  return "€ " + Number(n || 0).toLocaleString("nl-NL");
}
function moKm(n) {
  return Number(n || 0).toLocaleString("nl-NL") + " km";
}
function moEsc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}
function moDateNL(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

/* Placeholder-afbeelding (SVG) voor auto's zonder foto's */
function moPlaceholder(car) {
  const label = (car.merk + " " + car.model).toUpperCase();
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 540">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#1c1c24"/><stop offset="1" stop-color="#101014"/></linearGradient></defs>' +
    '<rect width="800" height="540" fill="url(#g)"/>' +
    '<path d="M140 330 C240 250 330 235 420 240 C510 245 560 265 640 320" stroke="#e11d2e" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.9"/>' +
    '<path d="M230 275 C300 225 380 215 470 228" stroke="#8a8a96" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.55"/>' +
    '<ellipse cx="395" cy="368" rx="200" ry="14" fill="#000" opacity="0.5"/>' +
    '<text x="400" y="440" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-size="34" font-style="italic" font-weight="900" fill="#f4f4f6" letter-spacing="2">' + label.replace(/&/g, "&amp;") + '</text>' +
    '<text x="400" y="478" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" fill="#6f6f7d">Foto’s volgen — bel voor meer informatie</text>' +
    "</svg>";
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
function moMainPhoto(car) {
  return (car.fotos && car.fotos.length) ? car.fotos[0] : moPlaceholder(car);
}

/* Persfoto's uit /fotos/ (witte achtergrond) worden "passend" getoond i.p.v. bijgesneden */
function moIsStudio(src) {
  return typeof src === "string" && src.indexOf("/fotos/") === 0;
}

/* Indicatief maandbedrag (financiering): 20% aanbetaling, 72 mnd, 8,9% rente */
function moMaandbedrag(prijs) {
  const p = Number(prijs) * 0.8, r = 0.089 / 12, n = 72;
  if (!p) return 0;
  return Math.round(p * r / (1 - Math.pow(1 + r, -n)));
}

/* Recent bekeken (max 6, nieuwste eerst) */
function moRecentOnthoud(id) {
  try {
    const lijst = JSON.parse(localStorage.getItem("mo_recent") || "[]").filter(x => x !== id);
    lijst.unshift(id);
    localStorage.setItem("mo_recent", JSON.stringify(lijst.slice(0, 6)));
  } catch (e) { /* opslag niet beschikbaar */ }
}
function moRecentLijst(excludeId) {
  try {
    return JSON.parse(localStorage.getItem("mo_recent") || "[]")
      .filter(id => id !== excludeId)
      .map(id => moGetCar(id))
      .filter(Boolean);
  } catch (e) { return []; }
}

/* Kaart-HTML voor overzichten */
function moCarCard(car) {
  const statusLabel = { "te-koop": "Te koop", "verkocht": "Verkocht", "gereserveerd": "Gereserveerd" }[car.status] || "Te koop";
  const photoCount = (car.fotos && car.fotos.length) ? car.fotos.length : 0;
  const hoofdfoto = moMainPhoto(car);
  const studio = moIsStudio(hoofdfoto);
  const maand = moMaandbedrag(car.prijs);
  return (
    '<article class="car-card reveal">' +
      '<a href="/occasion.html?id=' + encodeURIComponent(car.id) + '" aria-label="Bekijk ' + moEsc(car.merk + " " + car.model) + '">' +
        '<div class="car-media' + (studio ? " studio" : "") + '">' +
          (car.status !== "te-koop" ? '<span class="car-status ' + moEsc(car.status) + '">' + statusLabel + "</span>" : "") +
          '<img src="' + hoofdfoto + '" alt="' + moEsc(car.merk + " " + car.model + " " + car.uitvoering + " " + car.bouwjaar) + '" loading="lazy" width="800" height="540" ' +
            'onerror="this.onerror=null;this.closest(\'.car-media\').classList.remove(\'studio\');this.src=moPlaceholder(moGetCar(\'' + moEsc(car.id) + '\')||{merk:\'\',model:\'\'})">' +
          (photoCount > 1 ? '<span class="car-photos-count"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/></svg>' + photoCount + "</span>" : "") +
        "</div>" +
      "</a>" +
      '<div class="car-body">' +
        '<h3 class="car-title">' + moEsc(car.merk + " " + car.model) + "<small>" + moEsc(car.uitvoering || "") + "</small></h3>" +
        '<div class="car-specs">' +
          "<span>" + car.bouwjaar + "</span>" +
          "<span>" + moKm(car.km) + "</span>" +
          "<span>" + moEsc(car.brandstof) + "</span>" +
          "<span>" + moEsc(car.transmissie) + "</span>" +
        "</div>" +
        '<div class="car-foot">' +
          '<div class="car-price">' + moEuro(car.prijs) +
            (maand ? "<small>of v.a. " + moEuro(maand) + " p/m*</small>" : "<small>incl. rijklaar maken</small>") +
          "</div>" +
          '<a class="car-link" href="/occasion.html?id=' + encodeURIComponent(car.id) + '">Bekijken <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>' +
        "</div>" +
      "</div>" +
    "</article>"
  );
}
