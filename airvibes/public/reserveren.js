// Contactpagina: kalender met beschikbaarheid + versturen naar de reserverings-API
(function () {
  "use strict";

  var form = document.querySelector('form[name="reservering"]');
  var kalEl = document.getElementById("kalender");
  if (!form || !kalEl) return;

  var datumInput = document.getElementById("datum");
  var datumTekst = document.getElementById("datumTekst");
  var foutEl = document.getElementById("formFout");
  var knop = form.querySelector('button[type="submit"]');
  var geblokkeerd = new Set();
  var kal = null;

  function toonFout(tekst) {
    if (!foutEl) return;
    foutEl.textContent = tekst;
    foutEl.style.display = tekst ? "block" : "none";
  }

  function toonDatum(datum) {
    if (!datumTekst) return;
    var d = new Date(datum + "T12:00:00");
    datumTekst.textContent = "Gekozen datum: " + d.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  function bouwKalender() {
    kal = window.AVKalender(kalEl, {
      geblokkeerd: geblokkeerd,
      onSelect: function (datum) {
        datumInput.value = datum;
        toonDatum(datum);
        toonFout("");
      },
    });
  }

  fetch("/api/beschikbaarheid")
    .then(function (r) { return r.ok ? r.json() : { geblokkeerd: [] }; })
    .catch(function () { return { geblokkeerd: [] }; })
    .then(function (d) {
      geblokkeerd = new Set(d.geblokkeerd || []);
      bouwKalender();
    });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    toonFout("");

    if (!datumInput.value) {
      toonFout("Kies eerst een datum in de kalender.");
      return;
    }
    if (geblokkeerd.has(datumInput.value)) {
      toonFout("Deze datum is helaas niet beschikbaar. Kies een andere datum.");
      return;
    }

    var fd = new FormData(form);
    var data = {};
    fd.forEach(function (v, k) { data[k] = v; });

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
