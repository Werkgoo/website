document.documentElement.classList.add('js');
var CFG = window.HEEMS_CONFIG || {};

/* ---------- header ---------- */
var header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ---------- mobiel menu ---------- */
var navToggle = document.getElementById('navToggle'),
    navClose = document.getElementById('navClose'),
    mnav = document.getElementById('mnav');

function openMnav() {
  if (!mnav) return;
  mnav.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
  var eerste = mnav.querySelector('a');
  if (eerste) eerste.focus();
}
function closeMnav(terugNaarKnop) {
  if (!mnav) return;
  mnav.classList.remove('open');
  document.body.style.overflow = '';
  if (navToggle) {
    navToggle.setAttribute('aria-expanded', 'false');
    if (terugNaarKnop === true) navToggle.focus();
  }
}
if (navToggle) navToggle.addEventListener('click', openMnav);
if (navClose) navClose.addEventListener('click', function () { closeMnav(true); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && mnav && mnav.classList.contains('open')) closeMnav(true);
});

/* ---------- scroll-reveal ---------- */
var obs = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });

/* ---------- FAQ ---------- */
function toggleFaq(btn) {
  var item = btn.closest('.faq-item');
  var open = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function (i) {
    i.classList.remove('open');
    var b = i.querySelector('.faq-btn'); if (b) b.setAttribute('aria-expanded', 'false');
  });
  if (!open) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
}
document.querySelectorAll('.faq-btn').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });

/* ---------- voortgangsbalk ---------- */
var pbar = document.createElement('div');
pbar.className = 'pbar'; pbar.innerHTML = '<i></i>';
pbar.setAttribute('aria-hidden', 'true');
document.body.appendChild(pbar);
var pfill = pbar.firstChild;
window.addEventListener('scroll', function () {
  var h = document.documentElement.scrollHeight - window.innerHeight;
  pfill.style.width = (h > 0 ? (window.scrollY / h * 100) : 0) + '%';
}, { passive: true });

var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- lichte tilt op de hero ---------- */
var stageEl = document.querySelector('.mock-stage .stage');
if (stageEl && !reduce && window.matchMedia('(pointer: fine)').matches) {
  var wrap = stageEl.parentElement;
  wrap.addEventListener('mousemove', function (e) {
    var r = wrap.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    stageEl.style.transform = 'perspective(1100px) rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 3) + 'deg)';
  });
  wrap.addEventListener('mouseleave', function () { stageEl.style.transform = ''; });
}

/* ---------- geopend / gesloten ----------
   Ma t/m vr 08:00–17:30, zaterdag op afspraak, zondag gesloten.
   Pas dit aan als de openingstijden wijzigen (ook in de HTML). */
var OPENINGSTIJDEN = { 1: ['08:00', '17:30'], 2: ['08:00', '17:30'], 3: ['08:00', '17:30'],
                       4: ['08:00', '17:30'], 5: ['08:00', '17:30'], 6: null, 0: null };
var DAGEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];

function naarMinuten(t) { var d = t.split(':'); return (+d[0]) * 60 + (+d[1]); }

function openStatus(nu) {
  nu = nu || new Date();
  var dag = nu.getDay(), min = nu.getHours() * 60 + nu.getMinutes();
  var vandaag = OPENINGSTIJDEN[dag];
  if (vandaag && min >= naarMinuten(vandaag[0]) && min < naarMinuten(vandaag[1])) {
    return { open: true, tekst: 'Nu geopend · tot ' + vandaag[1] };
  }
  if (vandaag && min < naarMinuten(vandaag[0])) {
    return { open: false, tekst: 'Gesloten · vandaag open vanaf ' + vandaag[0] };
  }
  for (var i = 1; i <= 7; i++) {
    var d = (dag + i) % 7, u = OPENINGSTIJDEN[d];
    if (u) {
      var wanneer = i === 1 ? 'morgen' : DAGEN[d];
      return { open: false, tekst: 'Gesloten · ' + wanneer + ' open vanaf ' + u[0] };
    }
  }
  return { open: false, tekst: 'Gesloten' };
}

(function toonOpenStatus() {
  var doelen = document.querySelectorAll('[data-open-status]');
  if (!doelen.length) return;
  var st = openStatus();
  doelen.forEach(function (el) {
    el.className = 'open-status' + (st.open ? '' : ' dicht');
    el.innerHTML = '<i aria-hidden="true"></i> ' + st.tekst;
  });
  // markeer de rij van vandaag in een volledige weekopgave
  document.querySelectorAll('.hours').forEach(function (h) {
    var rijen = h.children;
    if (rijen.length !== 7) return;
    var index = (new Date().getDay() + 6) % 7; // maandag = 0
    rijen[index].classList.add('vandaag');
  });
})();

/* ---------- contactformulier ----------
   Het Formspree-form-ID staat in config.js. Zonder geldig ID komt de aanvraag
   niet aan en krijgt de bezoeker het telefoonnummer te zien. */
var EP = 'https://formspree.io/f/' + (CFG.formspreeId || 'YOUR_ID');
function sendForm(e) {
  e.preventDefault();
  var btn = document.getElementById('submitBtn');
  var oudeTekst = btn.textContent;
  btn.disabled = true; btn.textContent = 'Versturen…';
  fetch(EP, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(e.target) })
    .then(function (r) {
      if (!r.ok) throw new Error('mislukt');
      document.getElementById('formBody').style.display = 'none';
      var ok = document.getElementById('ok');
      ok.style.display = 'block';
      ok.setAttribute('tabindex', '-1');
      ok.focus();
    })
    .catch(function () {
      btn.disabled = false; btn.textContent = oudeTekst;
      var note = document.getElementById('formFail');
      if (!note) {
        note = document.createElement('p');
        note.id = 'formFail';
        note.className = 'form-note';
        note.setAttribute('role', 'alert');
        note.innerHTML = 'Verzenden lukte niet. Bel ons op <a href="tel:+31367505404">036 750 5404</a> of mail naar <a href="mailto:info@autobedrijfdeheems.nl">info@autobedrijfdeheems.nl</a>.';
        e.target.appendChild(note);
      }
    });
}
