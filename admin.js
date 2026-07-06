/* Motions Occasions — beheerscherm
   - Inlog (wachtwoord in localStorage, standaard: motions2026)
   - Voorraadbeheer via localStorage (zelfde bron als de website)
   - RDW-kentekencheck via opendata.rdw.nl (gratis, geen sleutel nodig)
   - AI-kentekenherkenning van foto's via Tesseract.js (volledig in de browser) */

moInitStore();

const PIN_KEY = "mo_pin";
const DEFAULT_PIN = "motions2026";

/* ---------- inloggen ---------- */
const loginView = document.getElementById("loginView");
const adminView = document.getElementById("adminView");

function isIngelogd() { return sessionStorage.getItem("mo_auth") === "1"; }
function toonAdmin() {
  loginView.hidden = true;
  adminView.hidden = false;
  renderVoorraad();
}
if (isIngelogd()) toonAdmin();

document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const pin = localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
  if (document.getElementById("loginPass").value === pin) {
    sessionStorage.setItem("mo_auth", "1");
    toonAdmin();
  } else {
    document.getElementById("loginError").hidden = false;
  }
});
document.getElementById("btnLogout").addEventListener("click", () => {
  sessionStorage.removeItem("mo_auth");
  location.reload();
});

/* ---------- toast ---------- */
let toastTimer;
function toast(msg, type) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show " + (type || "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3500);
}

/* ---------- tabs ---------- */
const tabs = document.querySelectorAll(".admin-tabs button");
function openTab(id) {
  tabs.forEach(b => b.classList.toggle("active", b.dataset.tab === id));
  ["tabVoorraad", "tabFormulier", "tabInstellingen"].forEach(t => {
    document.getElementById(t).hidden = t !== id;
  });
}
tabs.forEach(b => b.addEventListener("click", () => openTab(b.dataset.tab)));

/* ---------- voorraadtabel ---------- */
function renderVoorraad() {
  const cars = moLoadCars();
  document.getElementById("voorraadTotaal").textContent = "(" + cars.length + " auto's)";
  document.getElementById("voorraadBody").innerHTML = cars.map(c =>
    "<tr>" +
      '<td><img class="thumb" src="' + moMainPhoto(c) + '" alt=""></td>' +
      "<td><strong>" + moEsc(c.merk + " " + c.model) + "</strong><br><span style='color:var(--faint);font-size:.8rem'>" + moEsc(c.uitvoering || "") + " · " + c.bouwjaar + "</span></td>" +
      "<td>" + moEsc(c.kenteken || "—") + "</td>" +
      "<td>" + moEuro(c.prijs) + "</td>" +
      "<td>" + moKm(c.km) + "</td>" +
      '<td><span class="badge ' + moEsc(c.status) + '">' + moEsc(c.status).replace("-", " ") + "</span></td>" +
      '<td style="white-space:nowrap">' +
        '<button class="icon-btn" data-edit="' + moEsc(c.id) + '" title="Bewerken" aria-label="Bewerken">✎</button> ' +
        '<button class="icon-btn danger" data-del="' + moEsc(c.id) + '" title="Verwijderen" aria-label="Verwijderen">🗑</button>' +
      "</td>" +
    "</tr>"
  ).join("") || '<tr><td colspan="7" style="text-align:center;color:var(--faint);padding:30px">Nog geen auto\'s in de voorraad. Klik op "+ Auto toevoegen".</td></tr>';

  document.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => bewerkAuto(b.dataset.edit)));
  document.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => {
    const car = moGetCar(b.dataset.del);
    if (car && confirm("Weet u zeker dat u de " + car.merk + " " + car.model + " wilt verwijderen?")) {
      moSaveCars(moLoadCars().filter(c => c.id !== b.dataset.del));
      renderVoorraad();
      toast("Auto verwijderd", "ok");
    }
  }));
}

/* ---------- formulier ---------- */
let editId = null;   // id van de auto die bewerkt wordt (null = nieuw)
let fotos = [];      // dataURL's

const velden = {
  merk: "fMerkIn", model: "fModelIn", uitvoering: "fUitvoering", kleur: "fKleur",
  prijs: "fPrijsIn", km: "fKmIn", bouwjaar: "fBouwjaar", apk: "fApk",
  brandstof: "fBrandstofIn", transmissie: "fTransmissieIn", vermogen: "fVermogen",
  status: "fStatus", deuren: "fDeuren", zitplaatsen: "fZitplaatsen"
};
function veld(id) { return document.getElementById(id); }

function resetFormulier() {
  editId = null;
  fotos = [];
  document.getElementById("carForm").reset();
  document.getElementById("kentekenInput").value = "";
  document.getElementById("rdwStatus").textContent = "";
  document.getElementById("rdwStatus").className = "rdw-status";
  document.getElementById("ocrPreview").hidden = true;
  renderFotos();
}

document.getElementById("btnNieuw").addEventListener("click", () => { resetFormulier(); openTab("tabFormulier"); });
document.getElementById("btnAnnuleer").addEventListener("click", () => { resetFormulier(); openTab("tabVoorraad"); });

function bewerkAuto(id) {
  const car = moGetCar(id);
  if (!car) return;
  resetFormulier();
  editId = id;
  document.getElementById("kentekenInput").value = car.kenteken || "";
  Object.keys(velden).forEach(k => { if (car[k] !== undefined && car[k] !== null) veld(velden[k]).value = car[k]; });
  veld("fOpties").value = (car.opties || []).join("\n");
  veld("fOmschrijving").value = car.omschrijving || "";
  fotos = (car.fotos || []).slice();
  renderFotos();
  openTab("tabFormulier");
}

document.getElementById("carForm").addEventListener("submit", e => {
  e.preventDefault();
  const cars = moLoadCars();
  const merk = veld("fMerkIn").value.trim();
  const model = veld("fModelIn").value.trim();
  const car = {
    id: editId || (merk + "-" + model + "-" + Date.now()).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    kenteken: document.getElementById("kentekenInput").value.trim().toUpperCase(),
    merk, model,
    uitvoering: veld("fUitvoering").value.trim(),
    kleur: veld("fKleur").value.trim(),
    prijs: Number(veld("fPrijsIn").value) || 0,
    km: Number(veld("fKmIn").value) || 0,
    bouwjaar: Number(veld("fBouwjaar").value) || new Date().getFullYear(),
    apk: veld("fApk").value || "",
    brandstof: veld("fBrandstofIn").value,
    transmissie: veld("fTransmissieIn").value,
    vermogen: veld("fVermogen").value.trim(),
    status: veld("fStatus").value,
    deuren: Number(veld("fDeuren").value) || undefined,
    zitplaatsen: Number(veld("fZitplaatsen").value) || undefined,
    opties: veld("fOpties").value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean),
    omschrijving: veld("fOmschrijving").value.trim(),
    fotos: fotos.slice(),
    createdAt: editId ? (moGetCar(editId) || {}).createdAt || new Date().toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
  };
  const idx = cars.findIndex(c => c.id === car.id);
  if (idx >= 0) cars[idx] = car; else cars.unshift(car);
  try {
    moSaveCars(cars);
  } catch (err) {
    toast("Opslaan mislukt: opslag vol. Verwijder foto's of gebruik minder foto's per auto.", "err");
    return;
  }
  toast(editId ? "Auto bijgewerkt ✓" : "Auto toegevoegd ✓", "ok");
  resetFormulier();
  renderVoorraad();
  openTab("tabVoorraad");
});

/* ---------- RDW kentekencheck ---------- */
function normalizePlate(p) { return (p || "").toUpperCase().replace(/[^A-Z0-9]/g, ""); }
function formatPlate(p) {
  p = normalizePlate(p);
  if (p.length !== 6) return p;
  // Nederlandse sidecodes — bepaal streepjesposities op basis van letter/cijfer-patroon
  const pat = [...p].map(ch => (/[0-9]/.test(ch) ? "9" : "X")).join("");
  const groups = {
    "XX9999": [2, 4], "9999XX": [2, 4], "99XX99": [2, 4], "XX99XX": [2, 4],
    "XXXX99": [2, 4], "99XXXX": [2, 4], "99XXX9": [2, 5], "9XXX99": [1, 4],
    "XX999X": [2, 5], "X999XX": [1, 4], "XXX99X": [3, 5], "X99XXX": [1, 3]
  }[pat];
  if (!groups) return p;
  return p.slice(0, groups[0]) + "-" + p.slice(groups[0], groups[1]) + "-" + p.slice(groups[1]);
}
function titleCase(s) {
  return (s || "").toLowerCase().replace(/(^|[\s-])\S/g, c => c.toUpperCase());
}

const rdwStatus = document.getElementById("rdwStatus");
function setRdwStatus(msg, cls) { rdwStatus.textContent = msg; rdwStatus.className = "rdw-status " + (cls || ""); }

document.getElementById("kentekenInput").addEventListener("blur", e => {
  e.target.value = formatPlate(e.target.value);
});

document.getElementById("btnRdw").addEventListener("click", haalRdwOp);

async function haalRdwOp() {
  const plate = normalizePlate(document.getElementById("kentekenInput").value);
  if (plate.length < 5) { setRdwStatus("Vul eerst een geldig kenteken in.", "err"); return; }
  setRdwStatus("Bezig met ophalen bij de RDW…", "busy");
  try {
    const [voertuigRes, brandstofRes] = await Promise.all([
      fetch("https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=" + plate),
      fetch("https://opendata.rdw.nl/resource/8ys7-d773.json?kenteken=" + plate)
    ]);
    const voertuig = (await voertuigRes.json())[0];
    const brandstoffen = await brandstofRes.json();

    if (!voertuig) { setRdwStatus("Kenteken niet gevonden in het RDW-register. Controleer de invoer.", "err"); return; }

    document.getElementById("kentekenInput").value = formatPlate(plate);
    if (voertuig.merk) veld("fMerkIn").value = titleCase(voertuig.merk);
    if (voertuig.handelsbenaming) {
      // RDW zet soms het merk vóór de handelsbenaming; haal dat weg
      let naam = titleCase(voertuig.handelsbenaming);
      const merk = titleCase(voertuig.merk || "");
      if (merk && naam.toUpperCase().startsWith(merk.toUpperCase() + " ")) naam = naam.slice(merk.length + 1);
      veld("fModelIn").value = naam;
    }
    if (voertuig.eerste_kleur && voertuig.eerste_kleur !== "N.v.t.") veld("fKleur").value = titleCase(voertuig.eerste_kleur);
    if (voertuig.datum_eerste_toelating) veld("fBouwjaar").value = String(voertuig.datum_eerste_toelating).slice(0, 4);
    if (voertuig.vervaldatum_apk) {
      const apk = String(voertuig.vervaldatum_apk);
      veld("fApk").value = apk.slice(0, 4) + "-" + apk.slice(4, 6) + "-" + apk.slice(6, 8);
    }
    if (voertuig.aantal_deuren && Number(voertuig.aantal_deuren) > 0) veld("fDeuren").value = voertuig.aantal_deuren;
    if (voertuig.aantal_zitplaatsen) veld("fZitplaatsen").value = voertuig.aantal_zitplaatsen;

    if (brandstoffen.length > 1) {
      veld("fBrandstofIn").value = "Hybride";
    } else if (brandstoffen[0]) {
      const b = (brandstoffen[0].brandstof_omschrijving || "").toLowerCase();
      veld("fBrandstofIn").value =
        b.includes("diesel") ? "Diesel" :
        b.includes("elektr") ? "Elektrisch" :
        b.includes("lpg") ? "LPG" : "Benzine";
    }
    const kw = brandstoffen[0] && parseFloat(brandstoffen[0].nettomaximumvermogen);
    if (kw) veld("fVermogen").value = Math.round(kw * 1.3596) + " pk (" + Math.round(kw) + " kW)";

    const extra = [];
    if (voertuig.cilinderinhoud) extra.push(voertuig.cilinderinhoud + " cc");
    if (voertuig.catalogusprijs) extra.push("nieuwprijs " + moEuro(voertuig.catalogusprijs));
    setRdwStatus("✓ Gegevens opgehaald: " + titleCase(voertuig.merk) + " " + titleCase(voertuig.handelsbenaming || "") +
      (extra.length ? " (" + extra.join(", ") + ")" : "") + ". Controleer en vul aan waar nodig.", "ok");
  } catch (err) {
    setRdwStatus("Ophalen mislukt (geen verbinding met opendata.rdw.nl). Probeer het later opnieuw of vul handmatig in.", "err");
  }
}

/* ---------- AI-kentekenherkenning (OCR in de browser) ---------- */
const ocrFile = document.getElementById("ocrFile");
document.getElementById("btnOcr").addEventListener("click", () => ocrFile.click());
ocrFile.addEventListener("change", async () => {
  const file = ocrFile.files[0];
  if (!file) return;
  const preview = document.getElementById("ocrPreview");
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;

  const bar = document.getElementById("ocrProgressBar");
  document.getElementById("ocrProgress").hidden = false;
  bar.style.width = "5%";
  setRdwStatus("AI-model laden voor kentekenherkenning…", "busy");

  try {
    await laadTesseract();
    const worker = await Tesseract.createWorker("eng", 1, {
      logger: m => { if (m.status === "recognizing text") bar.style.width = Math.round(5 + m.progress * 90) + "%"; }
    });
    await worker.setParameters({ tessedit_char_whitelist: "ABCDEFGHJKLMNPRSTVXZ0123456789- " });
    setRdwStatus("Foto wordt geanalyseerd…", "busy");
    const { data } = await worker.recognize(file);
    await worker.terminate();
    bar.style.width = "100%";

    const plate = vindKenteken(data.text);
    if (plate) {
      document.getElementById("kentekenInput").value = formatPlate(plate);
      setRdwStatus("✓ Kenteken herkend: " + formatPlate(plate) + " — gegevens worden opgehaald…", "ok");
      await haalRdwOp();
    } else {
      setRdwStatus("Geen kenteken herkend op de foto. Probeer een scherpere foto (recht van voren, plaat goed leesbaar) of typ het kenteken handmatig.", "err");
    }
  } catch (err) {
    setRdwStatus("Kentekenherkenning niet beschikbaar (AI-bibliotheek kon niet laden). Typ het kenteken handmatig in.", "err");
  } finally {
    setTimeout(() => { document.getElementById("ocrProgress").hidden = true; bar.style.width = "0"; }, 800);
    ocrFile.value = "";
  }
});

function laadTesseract() {
  if (window.Tesseract) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function vindKenteken(tekst) {
  const schoon = (tekst || "").toUpperCase().replace(/[^A-Z0-9\n ]/g, " ");
  // Nederlandse kenteken-sidecodes (zonder streepjes)
  const patronen = [
    /\b[A-Z]{2}[0-9]{3}[A-Z]\b/, /\b[0-9][A-Z]{3}[0-9]{2}\b/, /\b[A-Z]{2}[0-9]{2}[A-Z]{2}\b/,
    /\b[0-9]{2}[A-Z]{3}[0-9]\b/, /\b[0-9]{2}[A-Z]{2}[0-9]{2}\b/, /\b[A-Z]{2}[A-Z]{2}[0-9]{2}\b/,
    /\b[0-9]{2}[0-9]{2}[A-Z]{2}\b/, /\b[A-Z]{3}[0-9]{2}[A-Z]\b/, /\b[A-Z][0-9]{2}[A-Z]{3}\b/,
    /\b[0-9]{2}[A-Z]{4}\b/, /\b[A-Z]{4}[0-9]{2}\b/
  ];
  // eerst per "woord" van 6 tekens proberen, ook met samengevoegde spaties
  const kandidaten = schoon.split(/\s+/).map(w => w.trim()).filter(w => w.length === 6)
    .concat(schoon.replace(/\s+/g, " ").split(" ").join("").match(/[A-Z0-9]{6}/g) || []);
  for (const k of kandidaten) {
    if (/[A-Z]/.test(k) && /[0-9]/.test(k)) {
      for (const p of patronen) if (p.test(k)) return k;
    }
  }
  // fallback: eerste 6-tekenreeks met letters én cijfers
  return kandidaten.find(k => /[A-Z]/.test(k) && /[0-9]/.test(k)) || null;
}

/* ---------- automatische omschrijving ---------- */
document.getElementById("btnGenDesc").addEventListener("click", () => {
  const merk = veld("fMerkIn").value.trim(), model = veld("fModelIn").value.trim();
  if (!merk || !model) { toast("Vul eerst merk en model in (of gebruik de kentekencheck).", "err"); return; }
  const uitv = veld("fUitvoering").value.trim();
  const jaar = veld("fBouwjaar").value;
  const km = Number(veld("fKmIn").value);
  const brandstof = veld("fBrandstofIn").value.toLowerCase();
  const trans = veld("fTransmissieIn").value.toLowerCase();
  const kleur = veld("fKleur").value.trim().toLowerCase();
  const apk = veld("fApk").value;
  const opties = veld("fOpties").value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);

  let d = "Nette " + merk + " " + model + (uitv ? " " + uitv : "") + " uit " + (jaar || "—") + ".";
  if (km) d += " De kilometerstand van " + km.toLocaleString("nl-NL") + " km is NAP-gecontroleerd.";
  if (kleur) d += " Uitgevoerd in " + kleur + (trans === "automaat" ? " met soepel schakelende automaat" : "") + ".";
  else if (trans === "automaat") d += " Voorzien van soepel schakelende automaat.";
  if (brandstof === "hybride") d += " Zuinige hybride aandrijving: comfortabel én voordelig rijden.";
  if (brandstof === "elektrisch") d += " Volledig elektrisch: fluisterstil en zonder wegenbelasting.";
  if (opties.length) d += " Rijk uitgerust met o.a. " + opties.slice(0, 4).join(", ").toLowerCase() + ".";
  if (apk) d += " APK geldig tot " + moDateNL(apk) + ".";
  d += "\n\nDe auto is volledig nagekeken in onze eigen werkplaats en wordt rijklaar geleverd met garantie. Proefrit maken? Bel ons of kom langs aan de Kamerlingh Onnesstraat 10 in Alkmaar.";
  veld("fOmschrijving").value = d;
  toast("Omschrijving gegenereerd — pas gerust aan", "ok");
});

/* ---------- foto's ---------- */
const dropzone = document.getElementById("dropzone");
const fotoFile = document.getElementById("fotoFile");
dropzone.addEventListener("click", () => fotoFile.click());
dropzone.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") fotoFile.click(); });
["dragover", "dragenter"].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.add("drag"); }));
["dragleave", "drop"].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.remove("drag"); }));
dropzone.addEventListener("drop", e => verwerkFotos(e.dataTransfer.files));
fotoFile.addEventListener("change", () => { verwerkFotos(fotoFile.files); fotoFile.value = ""; });

async function verwerkFotos(files) {
  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    if (fotos.length >= 8) { toast("Maximaal 8 foto's per auto.", "err"); break; }
    fotos.push(await verkleinFoto(file));
  }
  renderFotos();
}

function verkleinFoto(file) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1000;
      const schaal = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * schaal);
      canvas.height = Math.round(img.height * schaal);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.src = URL.createObjectURL(file);
  });
}

function renderFotos() {
  document.getElementById("photoStrip").innerHTML = fotos.map((f, i) =>
    '<div class="photo-thumb' + (i === 0 ? " main" : "") + '">' +
      '<img src="' + f + '" alt="Foto ' + (i + 1) + '">' +
      '<button type="button" class="rm" data-rm="' + i + '" aria-label="Foto verwijderen">✕</button>' +
      (i > 0 ? '<button type="button" class="make-main" data-main="' + i + '">hoofdfoto</button>' : "") +
    "</div>"
  ).join("");
  document.querySelectorAll("[data-rm]").forEach(b => b.addEventListener("click", () => { fotos.splice(Number(b.dataset.rm), 1); renderFotos(); }));
  document.querySelectorAll("[data-main]").forEach(b => b.addEventListener("click", () => {
    const i = Number(b.dataset.main);
    fotos.unshift(fotos.splice(i, 1)[0]);
    renderFotos();
  }));
}

/* ---------- instellingen ---------- */
document.getElementById("passForm").addEventListener("submit", e => {
  e.preventDefault();
  localStorage.setItem(PIN_KEY, document.getElementById("newPass").value);
  document.getElementById("newPass").value = "";
  toast("Wachtwoord gewijzigd ✓", "ok");
});

document.getElementById("btnExport").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(moLoadCars(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "motions-occasions-voorraad-" + new Date().toISOString().slice(0, 10) + ".json";
  a.click();
  URL.revokeObjectURL(a.href);
});

const importFile = document.getElementById("importFile");
document.getElementById("btnImport").addEventListener("click", () => importFile.click());
importFile.addEventListener("change", () => {
  const file = importFile.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data)) throw new Error("geen lijst");
      moSaveCars(data);
      renderVoorraad();
      toast("Voorraad geïmporteerd: " + data.length + " auto's ✓", "ok");
    } catch (err) {
      toast("Importeren mislukt: ongeldig bestand.", "err");
    }
  };
  reader.readAsText(file);
  importFile.value = "";
});

document.getElementById("btnReset").addEventListener("click", () => {
  if (confirm("De huidige voorraad wordt vervangen door de demo-voorraad. Doorgaan?")) {
    localStorage.removeItem(MO_STORE_KEY);
    moInitStore();
    renderVoorraad();
    toast("Demo-voorraad hersteld", "ok");
  }
});
