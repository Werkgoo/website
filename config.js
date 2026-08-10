/* ============================================================
   Instellingen voor de site en het beheerpaneel.
   Dit is het enige bestand dat je hoeft aan te passen.
   ============================================================ */
window.HEEMS_CONFIG = {

  /* --- Supabase (voor het beheerpaneel op /beheer) ---------------
     Laat leeg om de site te laten draaien op occasions.json.
     Zodra je hier een project invult, lezen de site én het beheer
     live uit de database. Zie supabase-schema.sql voor de tabel
     en de rechten. De publishable key mag publiek zijn — die geeft
     alleen leesrechten; bewerken kan uitsluitend na inloggen. */
  supabaseUrl: '',
  supabaseKey: '',

  /* --- Contactformulier -----------------------------------------
     Formulier-ID van formspree.io (het deel na /f/). */
  formspreeId: 'YOUR_ID',

  /* --- Bedrijfsgegevens (gebruikt in scripts) ------------------- */
  telefoon: '036 750 5404',
  telefoonLink: '+31367505404',
  email: 'info@autobedrijfdeheems.nl'
};
