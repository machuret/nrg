# NRG Finance — website

A fast, static, mobile-first website for **NRG Finance** — a mortgage and finance
broker serving the **Newcastle → Sydney corridor**. Built to the
[redesign brief](docs/redesign-brief.md): confident, clean and local; brand
**green, grey and black** palette; calculator and social proof above the fold;
copy that reads like a conversation, not a brochure.

No framework, no build step, no CDN runtime — just HTML, one CSS file and one
small JS file. It loads fast and deploys anywhere static.

## What's here

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero, savings/borrowing calculator, reviews, service tiles, why-NRG, About teaser, lender panel, CTA |
| About | `about.html` | Tim's story (Fire & Rescue, JP, local roots), credentials bar, the team |
| Refinancing | `refinancing.html` | The "money page" — scenario opener, plain-English explainer, calculator, 4-step process, testimonials, FAQ, comparison-rate warning |
| Debt Consolidation | `debt-consolidation.html` | "One payment instead of four" — before/after visual, reassuring tone |
| Home Loans | `home-loans.html` | First home buyers, NSW grants & schemes, borrowing-power calculator, lending process |
| Investment | `investment.html` | The warm "next step" — equity, rental income, high-level tax note |
| Contact | `contact.html` | Short form, click-to-call, address + map slot, booking slot |
| 404 | `404.html` | Branded not-found page |

```
.
├── index.html, about.html, refinancing.html, …   ← the 7 pages + 404
├── css/styles.css        ← the whole design system (tokens + components)
├── js/main.js            ← calculator, mobile nav, form, scroll reveal
├── assets/               ← favicon.svg, og-image.svg
├── robots.txt, sitemap.xml
├── docs/                 ← the original brief (.docx) + a markdown copy
└── design-source/        ← the original homepage design mockup (see below)
```

## How this was built

The upload included a high-fidelity **homepage design mockup** in a design-tool
format (`design-source/NRG Home.dc.html`, which client-renders via React from a
CDN using `support.js`). That mockup nailed the visual system, copy and
calculator maths — but as a CDN-React, client-rendered prototype it works
against the brief's hard requirements (sub-2s mobile load, real SEO/schema
markup, "no bloat").

So this repo is a faithful translation of that mockup into a **production static
site**, in the NRG brand palette (green `#1A9D6E` + grey + near-black `#1A1A1A`),
with the same fonts (Bebas Neue / Plus Jakarta Sans) and the **exact** calculator
formulas — re-expressed as clean, reusable CSS/JS — and extended to all seven
pages the brief calls for. (Token names like `--copper` are legacy and now hold
the brand green.)
The original mockup and its runtime are preserved under `design-source/` for
reference.

## Run it locally

It's static — open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Push to any static host — GitHub Pages, Netlify, Cloudflare Pages, S3. No build
command, no environment. Point the host at the repo root.

## Before launch — replace the placeholders

The structure, copy and design are production-ready. These items are deliberate
stand-ins:

- **Photography.** Hero, About and Home-Loans images are on-brand gradient
  placeholders with captions describing the shot needed (corridor streetscapes,
  Tim's casual-professional headshot). Drop in real photos per the brief — no
  stock handshakes.
- **Contact details.** Phone `02 4040 7000`, email `hello@nrgfinance.com.au`,
  and the Charlestown office address come from the design mockup. **Confirm the
  real NAP** (name, address, phone) before launch — it must match the Google
  Business Profile for local SEO.
- **Contact form.** Front-end only. It currently falls back to the visitor's
  mail client. Wire it to a form service (Formspree, Netlify Forms) or backend.
- **Booking + map.** The Contact page has slots for a Calendly (or similar)
  booking embed and a Google Maps iframe.
- **Reviews & lender logos.** Quotes and lender wordmarks are representative.
  Swap in real Google reviews and greyscale lender logo images.
- **Team.** Names/initials on the About page are placeholders.
- **Legal pages.** Footer links to Privacy Policy, Credit Guide, Terms and
  Complaints are stubbed (`#`) — add the real documents.
- **Domain.** Canonical URLs, sitemap and OG tags use
  `https://www.nrgfinance.com.au/`. Update if the live domain differs.

## Compliance & SEO baked in

- **Compliance on every page:** Australian Credit Licence **384496**, AFCA
  membership **44198**, best-interest-duty (ASIC RG209) wording, PI insurance
  note, and a comparison-rate warning where rates appear.
- **SEO:** unique `<title>`/meta per page, canonical URLs, Open Graph tags,
  `FinancialService` + `Service` + `FAQPage` JSON-LD schema with corridor-wide
  `areaServed`, semantic HTML, `sitemap.xml` and `robots.txt`.
- **Performance:** one stylesheet, one deferred script, inline SVG icons (no
  icon font), fonts with `preconnect` + `display=swap`. No framework runtime.

## Calculator

Two modes, mirroring the mockup exactly:

- **Savings** — principal-and-interest repayment difference between your current
  rate and a sharper one over a 25-year term; shows monthly, yearly and 5-year
  savings.
- **Borrowing power** — surplus-income annuity over 30 years at an assessment
  rate (your rate + 3% buffer), plus estimated buying power with your deposit.

All figures are clearly labelled as estimates, not offers of credit.
