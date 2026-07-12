// AirVibes kalenderwidget — gedeeld door contactpagina en beheer
(function () {
  "use strict";

  var MAANDEN = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  var DAGEN = ["ma", "di", "wo", "do", "vr", "za", "zo"];

  function fmt(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  // opts:
  //   geblokkeerd : Set van "YYYY-MM-DD" die niet gekozen kunnen worden
  //   markers     : Set van datums die een stip krijgen (bijv. dagen met reserveringen)
  //   admin       : true = klikken op elke toekomstige dag roept onToggle aan
  //   onSelect(datum) / onToggle(datum)
  window.AVKalender = function (el, opts) {
    var opt = Object.assign({ geblokkeerd: new Set(), markers: new Set(), admin: false, onSelect: null, onToggle: null }, opts || {});
    var nu = new Date();
    var minMaand = nu.getFullYear() * 12 + nu.getMonth();
    var cur = new Date(nu.getFullYear(), nu.getMonth(), 1);
    var selected = null;
    var vandaagStr = fmt(nu);

    function render() {
      var curMaand = cur.getFullYear() * 12 + cur.getMonth();
      var html = '<div class="kal-top">';
      html += '<button type="button" class="kal-nav" data-richting="-1" aria-label="Vorige maand"' + (curMaand <= minMaand ? " disabled" : "") + ">&#8249;</button>";
      html += '<span class="kal-titel">' + MAANDEN[cur.getMonth()] + " " + cur.getFullYear() + "</span>";
      html += '<button type="button" class="kal-nav" data-richting="1" aria-label="Volgende maand">&#8250;</button>';
      html += "</div>";
      html += '<div class="kal-grid">';
      for (var i = 0; i < 7; i++) html += '<span class="kal-wd">' + DAGEN[i] + "</span>";

      var eerste = new Date(cur.getFullYear(), cur.getMonth(), 1);
      var offset = (eerste.getDay() + 6) % 7; // week begint op maandag
      for (var o = 0; o < offset; o++) html += "<span></span>";

      var dagenInMaand = new Date(cur.getFullYear(), cur.getMonth() + 1, 0).getDate();
      for (var dag = 1; dag <= dagenInMaand; dag++) {
        var str = fmt(new Date(cur.getFullYear(), cur.getMonth(), dag));
        var cls = "kal-dag";
        var voorbij = str < vandaagStr;
        var blok = opt.geblokkeerd.has(str);
        if (voorbij) cls += " voorbij";
        if (blok) cls += " blok";
        if (str === vandaagStr) cls += " vandaag";
        if (str === selected) cls += " sel";
        if (opt.markers.has(str)) cls += " marker";
        var klikbaar = !voorbij && (opt.admin || !blok);
        html += '<button type="button" class="' + cls + '" data-datum="' + str + '"' + (klikbaar ? "" : " disabled") + ">" + dag + "</button>";
      }
      html += "</div>";
      el.innerHTML = html;

      el.querySelectorAll(".kal-nav").forEach(function (b) {
        b.addEventListener("click", function () {
          cur = new Date(cur.getFullYear(), cur.getMonth() + Number(b.dataset.richting), 1);
          render();
        });
      });
      el.querySelectorAll(".kal-dag:not([disabled])").forEach(function (b) {
        b.addEventListener("click", function () {
          var datum = b.dataset.datum;
          if (opt.admin) {
            if (opt.onToggle) opt.onToggle(datum);
          } else {
            selected = datum;
            render();
            if (opt.onSelect) opt.onSelect(datum);
          }
        });
      });
    }

    render();
    return {
      refresh: function (nieuw) {
        if (nieuw.geblokkeerd) opt.geblokkeerd = nieuw.geblokkeerd;
        if (nieuw.markers) opt.markers = nieuw.markers;
        render();
      },
      selecteer: function (datum) { selected = datum; render(); },
      getSelected: function () { return selected; },
    };
  };
})();
