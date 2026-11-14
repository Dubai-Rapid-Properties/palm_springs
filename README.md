# Palm Springs by Nakheel — Landing Page (D|R|P)

Live: https://palm-springs.dubairapidproperties.com/

A static, single-page site: `index.html` (HTML + CSS + small vanilla JS), with no framework and no build step.
Vercel serves the repository as-is, so **pushing to this branch deploys the site** (usually within a minute).

## 1. Contact details, form endpoint
Edit the `SITE_CONFIG` block near the bottom of `index.html`. Every WhatsApp, phone and email link on the page is generated from it:

| Key | What it is |
|---|---|
| `WHATSAPP_NUMBER` | Digits only, with country code, e.g. `971567770272` |
| `WHATSAPP_TEXT` | Pre-filled WhatsApp message |
| `PHONE_NUMBER` / `PHONE_DISPLAY` | `tel:` number and how it is shown |
| `EMAIL` | Contact email |
| `OFFICE_ADDRESS` | Shown in the contact section |
| `RERA_NUMBER` | Brokerage RERA / ORN / licence. Hidden while it says `RERA_NUMBER` |
| `FORM_ENDPOINT` | Where the lead form posts (see 3). Empty = WhatsApp hand-off |

`EUR_PER_AED` (just below the config) sets the EUR conversion: `925000 / 3800000` (AED 3.8M ≈ €925k).

## 2. Images and gallery
Put images in `images/palm-springs/<folder>/`:

| Folder | Gallery tab |
|---|---|
| `lagoon-villas/` | Lagoon Villas tab + the Lagoon Villa Designs slider |
| `exterior/` | Villas |
| `townhouses/` | Townhouses |
| `interiors/` | Interiors |
| `amenities/` | Amenities |
| `aerial/` | All tab only |

Because the site is plain static HTML, the gallery reads a manifest, `images/palm-springs/images.json`.
After adding or removing images, regenerate it:

```bash
pip install pillow
python3 tools/build_images.py
```

The script converts JPG/PNG to WebP (max 2000 px), records width/height (no layout shift), and builds alt text and captions from the file name.
Lagoon villa file names become design names: `lagoon-villa-modern-01.jpg` → "Modern".
Original JPG/PNGs are moved to `images/palm-springs/_originals/` (ignored by git and not deployed). You can hand-edit `alt`/`caption` in `images.json`; the script keeps your edits.
Empty folders show a "Coming at launch" panel with a register button.

## 3. Lead form
Fields: name, phone (with country code), email (optional), home type, buying for, consent, plus hidden `source_cta` (which button brought the lead) and UTM parameters.

- **With `FORM_ENDPOINT` set:** the lead is POSTed and a thank-you message is shown; if sending fails the visitor sees an error with a WhatsApp fallback.
- **Without it (current default):** the form does *not* pretend to save anything. It asks the visitor to send their details on WhatsApp (pre-filled message).

Recommended endpoint: **Google Apps Script → Google Sheet + email**. Follow the steps at the top of `tools/google-apps-script.gs`, then paste the Web app URL into `FORM_ENDPOINT`.

## 4. Deploy
```bash
git add -A
git commit -m "Update Palm Springs page"
git push origin claude/magical-ptolemy-udwsx8
```
Vercel picks up the push automatically. `.vercelignore` keeps `ads/`, `tools/` and original images out of the deployment.

## Other files
- `privacy.html`: privacy policy (also used for Meta lead forms)
- `ads/`: Meta / Instagram ad creatives and copy (`ads/AD-COPY.md`)
