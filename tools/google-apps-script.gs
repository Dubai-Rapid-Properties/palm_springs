/**
 * Palm Springs lead form → Google Sheet + email notification.
 *
 * Setup (about 5 minutes):
 *  1. Create a new Google Sheet, e.g. "Palm Springs Leads".
 *  2. In the sheet: Extensions → Apps Script. Delete the sample code and paste this file.
 *  3. Change NOTIFY_EMAIL below to the inbox that should receive new leads.
 *  4. Click Deploy → New deployment → type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *     Click Deploy, approve the permissions, and copy the Web app URL
 *     (it ends in /exec).
 *  5. In index.html set SITE_CONFIG.FORM_ENDPOINT to that URL, then push.
 *
 * Each submission adds a row to the "Leads" tab and sends you an email.
 * If you edit this script later, use Deploy → Manage deployments → Edit →
 * Version: New version, so the same URL keeps working.
 */
const NOTIFY_EMAIL = "office@dubairapidproperties.com";
const SHEET_NAME = "Leads";
const FIELDS = [
  "submitted_at", "name", "phone", "email", "unit", "purpose", "source_cta",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "currency", "page"
];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.company) return json_({ ok: true });            // spam honeypot
  if (!p.name || !p.phone) return json_({ ok: false, error: "missing fields" });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) sh.appendRow(FIELDS);
    sh.appendRow(FIELDS.map(f => String(p[f] || "").slice(0, 500)));
  } finally {
    lock.releaseLock();
  }

  const body = FIELDS.map(f => `${f}: ${p[f] || "-"}`).join("\n");
  MailApp.sendEmail(NOTIFY_EMAIL, `New Palm Springs lead: ${p.name} (${p.unit || "-"})`, body);
  return json_({ ok: true });
}

function doGet() {
  return json_({ ok: true, info: "Palm Springs lead endpoint is running." });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
