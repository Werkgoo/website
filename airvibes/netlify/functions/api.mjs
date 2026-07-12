// AirVibes reserverings-API
// Opslag: Netlify Blobs (store "airvibes-data")
//  - key "geblokkeerde-dagen": JSON-array van "YYYY-MM-DD"
//  - keys "res-<id>": één reservering per key
import { getStore } from "@netlify/blobs";

const JSONH = { "content-type": "application/json; charset=utf-8" };
const j = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: JSONH });
const DATUM_RE = /^\d{4}-\d{2}-\d{2}$/;
const STATUSSEN = ["nieuw", "bevestigd", "geannuleerd"];

// Datum van vandaag in Nederlandse tijd (sv-SE geeft YYYY-MM-DD)
const vandaag = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Amsterdam" }).format(new Date());

const tekst = (v, max) => (v == null ? "" : String(v)).trim().slice(0, max);

async function geblokkeerdeDagen(store) {
  return (await store.get("geblokkeerde-dagen", { type: "json" })) || [];
}

export default async (req) => {
  const url = new URL(req.url);
  const pad = url.pathname.replace(/\/+$/, "");
  const store = getStore("airvibes-data");

  // --- publiek: geblokkeerde dagen ophalen ---
  if (pad === "/api/beschikbaarheid" && req.method === "GET") {
    return j({ geblokkeerd: await geblokkeerdeDagen(store) });
  }

  // --- publiek: reservering indienen ---
  if (pad === "/api/reserveren" && req.method === "POST") {
    let b;
    try { b = await req.json(); } catch { return j({ fout: "Ongeldige aanvraag." }, 400); }
    if (tekst(b["bot-field"], 10)) return j({ ok: true }); // honeypot: doe alsof het lukte

    const res = {
      naam: tekst(b.naam, 120),
      email: tekst(b.email, 160),
      telefoon: tekst(b.telefoon, 40),
      datum: tekst(b.datum, 10),
      tijd: tekst(b.tijd, 40),
      plaats: tekst(b.plaats, 160),
      items: tekst(b.items, 1000),
      bericht: tekst(b.bericht, 2000),
    };
    if (!res.naam || !res.email.includes("@") || !res.items || !DATUM_RE.test(res.datum)) {
      return j({ fout: "Vul alle verplichte velden in." }, 400);
    }
    if (res.datum < vandaag()) {
      return j({ fout: "Kies een datum vanaf vandaag." }, 400);
    }
    if ((await geblokkeerdeDagen(store)).includes(res.datum)) {
      return j({ fout: "Deze datum is helaas niet beschikbaar. Kies een andere datum." }, 409);
    }

    const id = `res-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(id, { id, ...res, status: "nieuw", ontvangen: new Date().toISOString() });
    return j({ ok: true });
  }

  // --- beheer: alles hieronder vereist de beheercode ---
  if (pad.startsWith("/api/beheer")) {
    const code = process.env.BEHEER_CODE || "airvibes123";
    if (req.headers.get("x-beheer-code") !== code) {
      return j({ fout: "Onjuiste beheercode." }, 401);
    }

    // overzicht: alle reserveringen + geblokkeerde dagen
    if (pad === "/api/beheer/overzicht" && req.method === "GET") {
      const reserveringen = [];
      const { blobs } = await store.list({ prefix: "res-" });
      for (const blob of blobs) {
        const r = await store.get(blob.key, { type: "json" });
        if (r) reserveringen.push(r);
      }
      reserveringen.sort((a, z) => (z.ontvangen || "").localeCompare(a.ontvangen || ""));
      return j({ reserveringen, geblokkeerd: await geblokkeerdeDagen(store) });
    }

    // reservering bijwerken of verwijderen
    if (pad === "/api/beheer/reservering" && req.method === "POST") {
      const b = await req.json().catch(() => null);
      const id = tekst(b?.id, 60);
      if (!id.startsWith("res-")) return j({ fout: "Onbekende reservering." }, 400);
      if (b.actie === "verwijder") {
        await store.delete(id);
        return j({ ok: true });
      }
      if (!STATUSSEN.includes(b.status)) return j({ fout: "Ongeldige status." }, 400);
      const r = await store.get(id, { type: "json" });
      if (!r) return j({ fout: "Reservering niet gevonden." }, 404);
      r.status = b.status;
      await store.setJSON(id, r);
      return j({ ok: true, reservering: r });
    }

    // dag blokkeren of vrijgeven
    if (pad === "/api/beheer/dag" && req.method === "POST") {
      const b = await req.json().catch(() => null);
      const datum = tekst(b?.datum, 10);
      if (!DATUM_RE.test(datum)) return j({ fout: "Ongeldige datum." }, 400);
      let dagen = await geblokkeerdeDagen(store);
      dagen = b.geblokkeerd ? [...new Set([...dagen, datum])].sort() : dagen.filter((d) => d !== datum);
      await store.setJSON("geblokkeerde-dagen", dagen);
      return j({ geblokkeerd: dagen });
    }
  }

  return j({ fout: "Niet gevonden." }, 404);
};

export const config = {
  path: ["/api/beschikbaarheid", "/api/reserveren", "/api/beheer/overzicht", "/api/beheer/reservering", "/api/beheer/dag"],
};
