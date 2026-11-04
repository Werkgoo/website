# Werkgo landing page design

## Goal

Collect a submitted CV from a job seeker in construction, technical trades, installation or logistics. Keep one primary action. Traffic is planned from Google Ads; no ad campaigns or conversion tags are enabled by this change.

## Applied skills

- UI/UX Pro Max, NextLevelBuilder. Recruitment product lookup recommends flat design, a clear conversion route, visible field labels, accessible text, progressive disclosure and explicit error feedback. Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill .
- Landing Page Design, Elaya. Minimal conversion page structure, one typeface, named text styles, a consistent spacing scale, Phosphor icons, six FAQ items, one benefit text reveal and transform/opacity motion. Source: https://github.com/elayadesign/ai-design-skills .

The design search also returned a generic Inter/Playfair pairing that did not fit this service. It was rejected. Skill output is guidance rather than evidence that a page converts better. No conversion rate, invented testimonials, partner logos or job counts are shown.

## System

Manrope only, 400/500/600 weights. The refreshed lowercase wordmark uses outlined Manrope 700, with “go” inside an orange capsule. Header, footer, utility pages and favicon share this identity. Body 16/24, secondary text 14/20 and captions at least 12/16. Headings use 60/60, 48/48, 36/40 and 30/36, with smaller scale steps on mobile. Named CSS classes define these styles once. Main controls meet 44px touch targets. Inputs use 16px text on mobile.

White and neutral surfaces, charcoal text, dark green for primary actions and orange for the wordmark accent. Images introduce the four work areas. Phosphor regular icons and its MIT license are stored locally. All font and icon requests stay on the website origin.

The page order is introduction, field-of-work photo links, two-step CV signup, next steps, one short benefit statement, FAQ and a final signup CTA. No visitor account or employer enquiry route is introduced.

Transitions use cubic-bezier(.22,1,.36,1). Motion changes transform and opacity; the progress bar scales instead of changing animated width. Essential content stays visible without animation. Reduced-motion preferences disable motion. Without JavaScript, both form fieldsets remain visible and the native form can still submit.

## Verification and remaining work

Browser-checked at 320, 375, 390, 768, 1024 and 1440px with no horizontal overflow. Checked missing-CV validation, a dummy PDF, step changes and retained contact data after going back. HTML IDs, icon references and anchor targets are checked before publishing.

Netlify Forms receipt, suitable CV storage and access controls, legal controller details, retention policy and Google Ads conversion measurement remain production tasks. The preview toolbar frame is narrowly allowed from app.netlify.com to fix its blocked frame; other CSP restrictions remain in place.
