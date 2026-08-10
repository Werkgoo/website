/* ============================================================
   Occasion-data: laadt de voorraad en bouwt de kaartjes.
   Bron: Supabase wanneer ingesteld in config.js, anders
   het bestand occasions.json in deze map.
   ============================================================ */
(function () {
  var CFG = window.HEEMS_CONFIG || {};
  var H = {};

  H.hasDB = function () { return !!(CFG.supabaseUrl && CFG.supabaseKey); };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  H.esc = esc;

  function arr(v) {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string' && v.trim()) {
      try { var p = JSON.parse(v); if (Array.isArray(p)) return p; } catch (e) {}
      return v.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    }
    return [];
  }

  function normalise(o) {
    o = Object.assign({}, o);
    o.opties = arr(o.opties);
    o.fotos = arr(o.fotos);
    o.status = o.status || 'beschikbaar';
    o.prijs = Number(o.prijs) || 0;
    o.km = Number(o.km) || 0;
    o.bouwjaar = Number(o.bouwjaar) || '';
    return o;
  }
  H.normalise = normalise;

  H.euro = function (n) {
    return '€ ' + (Number(n) || 0).toLocaleString('nl-NL');
  };
  H.km = function (n) {
    return (Number(n) || 0).toLocaleString('nl-NL') + ' km';
  };
  var MAAND = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
  H.apk = function (v) {
    if (!v) return '—';
    var m = /^(\d{4})-(\d{2})/.exec(v);
    return m ? MAAND[parseInt(m[2], 10) - 1] + ' ' + m[1] : v;
  };
  H.titel = function (o) {
    return [o.merk, o.model].filter(Boolean).join(' ');
  };
  H.tags = function (o) {
    return [o.brandstof, o.transmissie, o.carrosserie]
      .filter(Boolean).join(' ').toLowerCase();
  };

  H.load = function () {
    if (H._cache) return Promise.resolve(H._cache);
    var p;
    if (H.hasDB()) {
      p = fetch(CFG.supabaseUrl.replace(/\/$/, '') + '/rest/v1/occasions?select=*&order=bouwjaar.desc', {
        headers: { apikey: CFG.supabaseKey, Authorization: 'Bearer ' + CFG.supabaseKey }
      }).then(function (r) { if (!r.ok) throw new Error('db'); return r.json(); })
        .catch(function () { return fetch('/occasions.json').then(function (r) { return r.json(); }); });
    } else {
      p = fetch('/occasions.json').then(function (r) { return r.json(); });
    }
    return p.then(function (list) {
      H._cache = (list || []).map(normalise);
      return H._cache;
    });
  };

  H.byId = function (id) {
    return H.load().then(function (list) {
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
      return null;
    });
  };

  /* ---- kaartje ---- */
  var THUMB_TINTS = ['', ' h2', ' h3'];

  H.thumb = function (o, i) {
    var tint = THUMB_TINTS[(i || 0) % 3];
    var inner = o.fotos.length
      ? '<img src="' + esc(o.fotos[0]) + '" alt="' + esc(H.titel(o)) + '" loading="lazy">'
      : '<svg class="car" viewBox="0 0 640 250" aria-hidden="true"><use href="#car-side"/></svg>' +
        '<span class="occ-photo-note">Foto volgt</span>';
    var badge = '';
    if (o.status === 'verkocht') badge = '<span class="occ-tag sold">Verkocht</span>';
    else if (o.status === 'gereserveerd') badge = '<span class="occ-tag ghost">Gereserveerd</span>';
    else if (o.label) badge = '<span class="occ-tag' + (o.label === 'Nieuw binnen' ? '' : ' ghost') + '">' + esc(o.label) + '</span>';
    return '<div class="occ-thumb' + tint + '">' + badge + inner + '</div>';
  };

  H.card = function (o, i) {
    var spec = function (icon, tekst) {
      return '<div><svg width="14" height="14" aria-hidden="true"><use href="#ic-' + icon + '"/></svg> ' + esc(tekst) + '</div>';
    };
    return '<a href="/occasion?id=' + encodeURIComponent(o.id) + '" class="occ-card' +
      (o.status === 'verkocht' ? ' is-sold' : '') + '" data-tags="' + esc(H.tags(o)) + '">' +
      H.thumb(o, i) +
      '<div class="occ-body">' +
        '<h3>' + esc(H.titel(o)) + '</h3>' +
        '<p class="occ-sub">' + esc([o.uitvoering, o.carrosserie, o.kleur].filter(Boolean).join(' · ')) + '</p>' +
        '<div class="occ-specs">' +
          spec('cal', o.bouwjaar) + spec('km', H.km(o.km)) +
          spec('fuel', o.brandstof) + spec('gear', o.transmissie) +
        '</div>' +
        '<div class="occ-foot">' +
          '<div class="occ-price">' + H.euro(o.prijs) +
            '<small>' + (o.prijs_type === 'excl_btw' ? 'excl. btw' : 'rijklaar') + '</small></div>' +
          '<span class="occ-cta">Bekijken</span>' +
        '</div>' +
      '</div></a>';
  };

  H.grid = function (el, list) {
    if (!el) return;
    el.innerHTML = list.map(function (o, i) { return H.card(o, i); }).join('');
  };

  window.Heems = H;
})();
