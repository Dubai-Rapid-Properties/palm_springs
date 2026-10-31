// HQ 1:1 townhouse versions: node ads/src/render-th.js
const { chromium } = require('playwright');
const path = require('path');
const out = path.resolve(__dirname, '..', 'hq');
(async () => {
  const b = await chromium.launch();
  for (const [q, n] of [['k=A&bg=th', '01-hero-townhouses-1x1-HQ'], ['k=U1', '05-townhouses-card-1x1-HQ']]) {
    const p = await b.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 2 });
    await p.goto('file://' + path.join(__dirname, 'creative.html') + `?${q}&s=s1&hq=1`, { waitUntil: 'networkidle' }).catch(()=>{});
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
    await p.locator('#c').screenshot({ path: path.join(out, n + '.png') });
    console.log(n);
    await p.close();
  }
  await b.close();
})();
