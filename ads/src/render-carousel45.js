// HQ 4:5 Instagram carousel: node ads/src/render-carousel45.js
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const out = path.resolve(__dirname, '..', 'hq', 'carousel-4x5');
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const cards = ['A','B','U1','U2','U3','E'];
  for (let i = 0; i < cards.length; i++) {
    const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
    await p.goto('file://' + path.join(__dirname, 'creative.html') + `?k=${cards[i]}&s=s45&hq=1`, { waitUntil: 'networkidle' }).catch(()=>{});
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
    const f = path.join(out, `carousel-4x5-${i+1}.png`);
    await p.locator('#c').screenshot({ path: f }); console.log(path.basename(f));
    await p.close();
  }
  await b.close();
})();
