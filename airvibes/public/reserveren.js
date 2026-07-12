// Contactpagina: productkeuze + kalender met beschikbaarheid + versturen naar de reserverings-API
(function () {
  "use strict";

  var form = document.querySelector('form[name="reservering"]');
  var kalEl = document.getElementById("kalender");
  if (!form || !kalEl) return;

  var datumInput = document.getElementById("datum");
  var itemsInput = document.getElementById("itemsSamengesteld");
  var extrasInput = document.getElementById("extras");
  var datumTekst = document.getElementById("datumTekst");
  var foutEl = document.getElementById("formFout");
  var knop = form.querySelector('button[type="submit"]');
  var checkboxes = Array.prototype.slice.call(form.querySelectorAll('input[name="producten"]'));

  var algemeenGeblokkeerd = new Set();
  var perProduct = {}; // { productId: ["YYYY-MM-DD"] }
  var kal = null;

  function toonFout(tekst) {
    if (!foutEl) return;
    foutEl.textContent = tekst;
    foutEl.style.display = tekst ? "block" : "none";
  }

  function toonDatum(datum) {
    if (!datumTekst) return;
    if (!datum) { datumTekst.textContent = ""; return; }
    var d = new Date(datum + "T12:00:00");
    datumTekst.textContent = "Gekozen datum: " + d.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  function gekozenIds() {
    return checkboxes.filter(function (c) { return c.checked; }).map(function (c) { return c.dataset.id; });
  }

  function gekozenNamen() {
    return checkboxes.filter(function (c) { return c.checked; }).map(function (c) { return c.value; });
  }

  // alle dagen die niet kunnen: bedrijfsbreed + de dagen van de aangevinkte producten
  function geblokkeerdNu() {
    var alles = new Set(algemeenGeblokkeerd);
    gekozenIds().forEach(function (id) {
      (perProduct[id] || []).forEach(function (d) { alles.add(d); });
    });
    return alles;
  }

  function verversKalender() {
    var blokken = geblokkeerdNu();
    if (kal) kal.refresh({ geblokkeerd: blokken });
    // was er al een datum gekozen die nu niet meer kan? maak de keuze ongedaan
    if (datumInput.value && blokken.has(datumInput.value)) {
      datumInput.value = "";
      toonDatum("");
      if (kal) kal.selecteer(null);
      toonFout("De eerder gekozen datum is niet beschikbaar voor deze productkeuze. Kies een andere datum.");
    }
  }

  fetch("/api/beschikbaarheid")
    .then(function (r) { return r.ok ? r.json() : {}; })
    .catch(function () { return {}; })
    .then(function (d) {
      algemeenGeblokkeerd = new Set(d.geblokkeerd || []);
      perProduct = d.producten || {};
      kal = window.AVKalender(kalEl, {
        geblokkeerd: geblokkeerdNu(),
        onSelect: function (datum) {
          datumInput.value = datum;
          toonDatum(datum);
          toonFout("");
        },
      });
    });

  checkboxes.forEach(function (c) { c.addEventListener("change", verversKalender); });

  // product voorselecteren via /contact?item=...
  var vooraf = new URLSearchParams(window.location.search).get("item");
  if (vooraf) {
    var lager = vooraf.toLowerCase();
    var match = checkboxes.find(function (c) { return c.value.toLowerCase().indexOf(lager) !== -1 || lager.indexOf(c.value.toLowerCase()) !== -1; });
    if (match) {
      match.checked = true;
    } else if (extrasInput && !extrasInput.value) {
      extrasInput.value = vooraf;
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    toonFout("");

    var namen = gekozenNamen();
    var extras = (extrasInput && extrasInput.value.trim()) || "";
    if (!namen.length && !extras) {
      toonFout("Vink minstens één product aan, of vul bij feestartikelen in wat je wilt huren.");
      return;
    }
    if (!datumInput.value) {
      toonFout("Kies eerst een datum in de kalender.");
      return;
    }
    if (geblokkeerdNu().has(datumInput.value)) {
      toonFout("Deze datum is helaas niet beschikbaar voor deze productkeuze. Kies een andere datum.");
      return;
    }

    // leesbare samenvatting voor e-mail en beheer
    itemsInput.value = namen.concat(extras ? ["Extra's: " + extras] : []).join(", ");

    var fd = new FormData(form);
    var data = {};
    fd.forEach(function (v, k) {
      if (k === "producten") return; // gaat als aparte lijst mee
      data[k] = v;
    });
    data.producten = gekozenIds();

    knop.disabled = true;
    var origineel = knop.textContent;
    knop.textContent = "Versturen…";

    fetch("/api/reserveren", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) {
          if (!r.ok) throw new Error(d.fout || "Er ging iets mis. Probeer het opnieuw of mail info@airvibes.nl.");
          // backup naar Netlify Forms, zodat e-mailnotificaties ook blijven werken
          return fetch("/", {
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(fd).toString(),
          }).catch(function () {});
        });
      })
      .then(function () { window.location.href = "/bedankt"; })
      .catch(function (err) {
        toonFout(err.message);
        knop.disabled = false;
        knop.textContent = origineel;
      });
  });
})();
