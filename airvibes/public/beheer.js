// AirVibes beheerpaneel: aanvragen bekijken + dagen blokkeren (algemeen of per product)
(function () {
  "use strict";

  var loginVak = document.getElementById("loginVak");
  var paneel = document.getElementById("paneel");
  if (!loginVak || !paneel) return;

  var loginForm = document.getElementById("loginForm");
  var loginFout = document.getElementById("loginFout");
  var resLijst = document.getElementById("resLijst");
  var blokLijst = document.getElementById("blokLijst");
  var blokTitel = document.getElementById("blokTitel");
  var legVast = document.getElementById("legVast");
  var statsEl = document.getElementById("stats");
  var kalEl = document.getElementById("beheerKalender");
  var scopeSelect = document.getElementById("scopeSelect");
  var PRODUCTEN = window.AV_PRODUCTEN || [];

  var kal = null;
  var geblokkeerd = new Set();    // bedrijfsbreed
  var perProduct = {};            // { productId: ["YYYY-MM-DD"] }
  var reserveringen = [];
  var scope = "";                 // "" = hele bedrijf, anders product-id

  // scope-keuzelijst vullen
  scopeSelect.innerHTML =
    '<option value="">Hele bedrijf (alle producten)</option>' +
    PRODUCTEN.map(function (p) { return '<option value="' + p.id + '">' + p.naam + "</option>"; }).join("");
  scopeSelect.addEventListener("change", function () {
    scope = scopeSelect.value;
    renderKalender();
    renderBlokLijst();
  });

  function code() { return sessionStorage.getItem("avBeheerCode") || ""; }

  function api(pad, body) {
    return fetch(pad, {
      method: body ? "POST" : "GET",
      headers: { "x-beheer-code": code(), "content-type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (r.status === 401) { var e = new Error(d.fout || "Onjuiste beheercode."); e.auth = true; throw e; }
        if (!r.ok) throw new Error(d.fout || "Er ging iets mis.");
        return d;
      });
    });
  }

  function datumMooi(str) {
    if (!str) return "—";
    var d = new Date(str + "T12:00:00");
    return d.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }

  function ontvangenMooi(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function scopeDagen() {
    return scope ? new Set(perProduct[scope] || []) : new Set(geblokkeerd);
  }

  function renderStats() {
    var nieuw = reserveringen.filter(function (r) { return r.status === "nieuw"; }).length;
    var bevestigd = reserveringen.filter(function (r) { return r.status === "bevestigd"; }).length;
    statsEl.innerHTML =
      '<span class="chip chip-geel">' + nieuw + " nieuw</span>" +
      '<span class="chip chip-groen">' + bevestigd + " bevestigd</span>" +
      '<span class="chip">' + reserveringen.length + " totaal</span>";
  }

  function renderReserveringen() {
    if (!reserveringen.length) {
      resLijst.innerHTML = '<div class="res-leeg">Nog geen aanvragen binnen. Zodra iemand het formulier invult, verschijnt de aanvraag hier.</div>';
      return;
    }
    resLijst.innerHTML = reserveringen.map(function (r) {
      var acties = "";
      if (r.status !== "bevestigd") acties += '<button class="btn btn-sm btn-primary" data-actie="bevestigd" data-id="' + r.id + '">✓ Bevestigen</button>';
      if (r.status !== "geannuleerd") acties += '<button class="btn btn-sm" data-actie="geannuleerd" data-id="' + r.id + '">Annuleren</button>';
      if (r.status !== "nieuw") acties += '<button class="btn btn-sm" data-actie="nieuw" data-id="' + r.id + '">Terug naar nieuw</button>';
      acties += '<button class="btn btn-sm btn-ghost" data-actie="verwijder" data-id="' + r.id + '">🗑 Verwijderen</button>';
      return (
        '<article class="res-kaart st-' + esc(r.status) + '">' +
        '<header class="res-kop"><strong>' + esc(r.naam) + '</strong><span class="st-badge st-' + esc(r.status) + '">' + esc(r.status) + "</span></header>" +
        '<div class="res-regels">' +
        "<p>📅 <strong>" + datumMooi(r.datum) + "</strong>" + (r.tijd ? " · " + esc(r.tijd) : "") + "</p>" +
        (r.plaats ? "<p>📍 " + esc(r.plaats) + "</p>" : "") +
        "<p>🎪 " + esc(r.items || "—") + "</p>" +
        (r.bericht ? '<p class="res-bericht">💬 ' + esc(r.bericht) + "</p>" : "") +
        '<p class="res-contact">✉️ <a href="mailto:' + esc(r.email) + '">' + esc(r.email) + "</a>" +
        (r.telefoon ? ' · 📞 <a href="tel:' + esc(r.telefoon) + '">' + esc(r.telefoon) + "</a>" : "") + "</p>" +
        '<p class="res-ontvangen">Ontvangen: ' + ontvangenMooi(r.ontvangen) + "</p>" +
        "</div>" +
        '<footer class="res-acties">' + acties + "</footer>" +
        "</article>"
      );
    }).join("");

    resLijst.querySelectorAll("button[data-actie]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.dataset.id;
        var actie = b.dataset.actie;
        if (actie === "verwijder") {
          if (!confirm("Weet je zeker dat je deze aanvraag definitief wilt verwijderen?")) return;
          api("/api/beheer/reservering", { id: id, actie: "verwijder" }).then(laden).catch(toonFoutmelding);
        } else {
          api("/api/beheer/reservering", { id: id, status: actie }).then(laden).catch(toonFoutmelding);
        }
      });
    });
  }

  function renderBlokLijst() {
    var naam = scope ? (PRODUCTEN.find(function (p) { return p.id === scope; }) || {}).naam : null;
    blokTitel.textContent = naam ? "Geblokkeerde dagen — " + naam : "Geblokkeerde dagen — hele bedrijf";
    var dagen = Array.from(scopeDagen()).sort();
    if (!dagen.length) {
      blokLijst.innerHTML = '<span style="color:var(--muted);font-size:.92rem">' +
        (scope ? "Geen geblokkeerde dagen voor dit product." : "Geen bedrijfsbrede blokkades — alle dagen zijn te boeken.") + "</span>";
      return;
    }
    blokLijst.innerHTML = dagen.map(function (d) {
      return '<span class="blok-item">' + datumMooi(d) + ' <button data-datum="' + d + '" aria-label="Dag vrijgeven">×</button></span>';
    }).join("");
    blokLijst.querySelectorAll("button[data-datum]").forEach(function (b) {
      b.addEventListener("click", function () { toggleDag(b.dataset.datum, false); });
    });
  }

  function markers() {
    var relevant = reserveringen.filter(function (r) {
      if (r.status === "geannuleerd") return false;
      if (!scope) return true;
      return (r.producten || []).indexOf(scope) !== -1;
    });
    return new Set(relevant.map(function (r) { return r.datum; }));
  }

  function renderKalender() {
    var vast = scope ? new Set(geblokkeerd) : new Set();
    legVast.style.display = scope ? "" : "none";
    var data = { geblokkeerd: scopeDagen(), vast: vast, markers: markers() };
    if (!kal) {
      kal = window.AVKalender(kalEl, Object.assign({ admin: true, onToggle: function (datum) { toggleDag(datum, !scopeDagen().has(datum)); } }, data));
    } else {
      kal.refresh(data);
    }
  }

  function toggleDag(datum, blokkeren) {
    var body = { datum: datum, geblokkeerd: blokkeren };
    if (scope) body.product = scope;
    api("/api/beheer/dag", body)
      .then(function (d) {
        geblokkeerd = new Set(d.geblokkeerd || []);
        perProduct = d.producten || {};
        renderKalender();
        renderBlokLijst();
      })
      .catch(toonFoutmelding);
  }

  function toonFoutmelding(err) {
    if (err.auth) { uitloggen(); return; }
    alert(err.message);
  }

  function laden() {
    return api("/api/beheer/overzicht").then(function (d) {
      reserveringen = d.reserveringen || [];
      geblokkeerd = new Set(d.geblokkeerd || []);
      perProduct = d.producten || {};
      renderStats();
      renderReserveringen();
      renderKalender();
      renderBlokLijst();
      loginVak.hidden = true;
      paneel.hidden = false;
    });
  }

  function uitloggen() {
    sessionStorage.removeItem("avBeheerCode");
    paneel.hidden = true;
    loginVak.hidden = false;
    kal = null;
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    loginFout.style.display = "none";
    sessionStorage.setItem("avBeheerCode", document.getElementById("code").value);
    laden().catch(function (err) {
      sessionStorage.removeItem("avBeheerCode");
      loginFout.textContent = err.auth ? "Onjuiste beheercode. Probeer het opnieuw." : err.message;
      loginFout.style.display = "block";
    });
  });

  document.getElementById("verversKnop").addEventListener("click", function () { laden().catch(toonFoutmelding); });
  document.getElementById("uitlogKnop").addEventListener("click", uitloggen);

  // automatisch inloggen als de code nog in deze sessie staat
  if (code()) laden().catch(uitloggen);
})();
