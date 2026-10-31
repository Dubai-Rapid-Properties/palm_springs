// High-quality (2x) render of set 1: node ads/src/render-hq.js
const { chromium } = require('playwright');
const path = require('path');
const out = path.resolve(__dirname, '..', 'hq');
const sizes = { s1: [1080,1080,'1x1'], s916: [1080,1920,'9x16'], s169: [1920,1080,'16x9'] };
(async () => {
  require('fs').mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const s of Object.keys(sizes)) {
    const [w,h,n] = sizes[s];
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    await p.goto('file://' + path.join(__dirname, 'creative.html') + `?k=A&s=${s}&hq=1`, { waitUntil: 'networkidle' }).catch(()=>{});
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(500);
    const f = path.join(out, `01-hero-${n}-HQ.png`);
    await p.locator('#c').screenshot({ path: f });
    console.log(f);
    await p.close();
  }
  await b.close();
})();
