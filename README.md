# Palm Springs by Nakheel — Landing Page

A single-file lead-generation landing page (`index.html`) for the Palm Springs pre-launch campaign. It has no build step or dependencies.

## Before going live
Edit the `CONFIG` block at the bottom of `index.html`:

| Key | What it does |
|---|---|
| `whatsapp` | WhatsApp number, digits only with country code (e.g. `971501234567`) |
| `phone` | Phone number shown and dialled |
| `agency` | Brokerage name in the footer |
| `formEndpoint` | Optional URL that receives leads as JSON POST (Formspree, Make, Zapier, Google Apps Script) |
| `openWhatsAppOnSubmit` | Also opens WhatsApp with the lead details after submit |

Also add your RERA / ORN number to the footer if required, plus Meta Pixel / Google Tag snippets in `<head>`. The form already fires `fbq('track','Lead')` and `gtag('event','generate_lead')` if those are present.

UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) are captured into the form automatically.

## Deploy
Upload `index.html` to any static host (GitHub Pages, Netlify, Vercel, cPanel).

## Images
`images/` holds every image the page uses.
- `ps-*.webp`: representative Palm Springs renders, supplied by a partner (dnkre.com).
- `sheikh-zayed-road.webp`, `lounge.webp`, `bedroom.webp`: Unsplash photos (Unsplash License).

When Nakheel releases official renders, replace these files and keep the same names. The page already labels all imagery as representative.
