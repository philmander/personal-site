# Safe Studios — brand identity brief

Paste this into a new claude.ai/design project, together with the three files
alongside it (`safestudios-landing.html`, `safestudios.css`, `deck-icon.png`).
They are the live v1 of safestudios.nl — iterate on top of them, don't start over.

## What Safe Studios is

A boutique one-person software studio in Amsterdam building audio software for
DJs. One shipped product: **Deck**, a professional audio player for iOS and
Android (a virtual CDJ — a *player*, never "mixer" or "controller"). Sold once,
no ads, no subscriptions, no data collected.

## The name — critical

"Safe" is **British slang** (good / sound / agreed), from the same UK
soundsystem culture as the music Deck is built for. It is **not** a security
reference. Reject anything that pulls toward infosec: shields, padlocks,
vaults, "trusted", "secure", enterprise blue. The v1 page disambiguates with a
small dictionary gloss under the hero — `/seɪf/ adj. British slang — good;
sound; agreed.` — kept small, muted, unexplained. Keep that move (or better it).

## Voice

Premium restraint. Confident, minimal, scene-literate; the opposite of trashy
freemium DJ-app marketing. No keyword stuffing, no exclamation marks, no
feature-shouting. Short declarative sentences. Dry humour allowed ("No CDJ, no
problem").

## Design system (v1, in safestudios.css)

- **Relationship to Deck:** the studio is the frame, the product is the colour.
  Studio surfaces are monochrome bone-on-black; Deck's acid-yellow accent
  `#faff63` appears ONLY where Deck itself appears. Both sites share IBM Plex
  Sans so they read as one family.
- Tokens: bg `#0a0a0c` · panels `#101013` · lines `#202024` · text (bone)
  `#ece9e3` · muted `#93908a` · accent `#faff63` (Deck-only)
- Type: IBM Plex Sans 400/500/600, tight negative letter-spacing on headings
- Current mark: a three-bar level-meter glyph (audio, pointedly not a padlock).
  Placeholder-quality — a real wordmark/logotype is an open problem.

## Page structure (v1)

Nav (mark + wordmark, 3 links) → hero ("A boutique software studio." + gloss)
→ 01 WORK (single Deck card: icon, blurb, capability chips, store links)
→ 02 APPROACH (three principles: native not wrapped · sold once not rented ·
built by someone who plays) → 03 CONTACT (support@safestudios.nl) → footer.

## What to explore in Claude Design

1. A proper wordmark / logotype for Safe Studios (the mark is the weakest part)
2. Hero treatment — currently pure type; could carry more identity
3. The gloss as a signature brand element across surfaces
4. Social/OG card, email signature, favicon refinements
5. Comps must stay implementable as a single static HTML/CSS page — no
   frameworks; the site is server-rendered TypeScript templates.

## Constraints

- Legal/store reality: Apple seller name is currently PHILIP MANDER (individual
  account; migration to organization in progress). Don't design anything that
  pretends otherwise on store surfaces.
- deck.dj is the product domain (DNS pending); safestudios.nl serves both for
  now. Apple's organization check wants safestudios.nl to read plainly as the
  company's site.
- Links: App Store https://apps.apple.com/app/id6791237893 ·
  Google Play https://play.google.com/store/apps/details?id=com.philmander.deck
