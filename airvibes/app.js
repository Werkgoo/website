// AirVibes — site interactie
(function () {
  "use strict";

  // Mobiele navigatie
  var mnav = document.getElementById("mnav");
  var toggle = document.getElementById("navToggle");
  var close = document.getElementById("navClose");
  if (toggle && mnav) {
    toggle.addEventListener("click", function () { mnav.classList.add("open"); });
  }
  if (close && mnav) {
    close.addEventListener("click", function () { mnav.classList.remove("open"); });
  }
  if (mnav) {
    mnav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { mnav.classList.remove("open"); });
    });
  }

  // Jaartal in footer
  document.querySelectorAll("#year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Reveal-on-scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // Contactformulier: item uit ?item=... voorinvullen
  var itemsField = document.getElementById("items");
  if (itemsField && !itemsField.value) {
    var item = new URLSearchParams(window.location.search).get("item");
    if (item) itemsField.value = item;
  }

  // Datumveld: geen datums in het verleden
  var dateField = document.getElementById("datum");
  if (dateField) {
    dateField.min = new Date().toISOString().split("T")[0];
  }
})();
