/* Motions Occasions — sitebrede interactie */

moInitStore();

/* mobiele navigatie */
const navToggle = document.getElementById("navToggle");
const mnav = document.getElementById("mnav");
if (navToggle && mnav) {
  navToggle.addEventListener("click", () => { mnav.classList.add("open"); document.body.style.overflow = "hidden"; });
  const close = document.getElementById("navClose");
  if (close) close.addEventListener("click", closeMnav);
}
function closeMnav() {
  if (mnav) { mnav.classList.remove("open"); document.body.style.overflow = ""; }
}

/* scroll-reveal */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  const watch = () => document.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));
  watch();
  window.moRewatchReveal = watch;
  // vangnet: toon alles alsnog (o.a. voor zoekmachines en printen)
  setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach(el => el.classList.add("in")), 3500);
} else {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
  window.moRewatchReveal = function () {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
  };
}

/* openingstijden: markeer vandaag */
document.querySelectorAll(".hours tr[data-day]").forEach(tr => {
  if (Number(tr.dataset.day) === new Date().getDay()) tr.classList.add("today");
});

/* uitgelichte occasions op de homepage */
const featuredGrid = document.getElementById("featuredCars");
if (featuredGrid) {
  const cars = moLoadCars().filter(c => c.status !== "verkocht").slice(0, 3);
  featuredGrid.innerHTML = cars.length
    ? cars.map(moCarCard).join("")
    : '<div class="empty-state">Ons actuele aanbod staat binnenkort online. Bel ons gerust voor de nieuwste binnenkomers!</div>';
  window.moRewatchReveal();
  const counter = document.getElementById("stockCount");
  if (counter) counter.textContent = moLoadCars().filter(c => c.status === "te-koop").length;
}

/* contact-/interesseformulier → opent e-mail met ingevulde gegevens */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    if (contactForm.querySelector(".hp-field input") && contactForm.querySelector(".hp-field input").value) return; // honeypot
    const data = new FormData(contactForm);
    const subject = data.get("onderwerp") || "Bericht via motionsoccasions.nl";
    const body =
      "Naam: " + (data.get("naam") || "") + "\n" +
      "Telefoon: " + (data.get("telefoon") || "") + "\n" +
      "E-mail: " + (data.get("email") || "") + "\n\n" +
      (data.get("bericht") || "");
    location.href = "mailto:info@motionsoccasions.nl?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    const ok = document.getElementById("formSuccess");
    if (ok) ok.hidden = false;
  });
}
