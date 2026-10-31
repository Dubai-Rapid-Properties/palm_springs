// Renders every ad creative to PNG: node ads/src/render.js
const { chromium } = require('playwright');
const path = require('path');
const out = path.resolve(__dirname, '..');
const sizes = { s1: [1080,1080,'1x1'], s916: [1080,1920,'9x16'], s169: [1920,1080,'16x9'] };
const jobs = [];
for (const k of ['A','B','C','D']) for (const s of Object.keys(sizes)) jobs.push([k, s, `${k}-${sizes[s][2]}`]);
['A','B','U1','U2','U3','E'].forEach((k,i)=>jobs.push([k,'s1',`carousel-${i+1}`]));
const names = {A:'01-hero',B:'02-location',C:'03-homes',D:'04-brochure'};
(async () => {
  const b = await chromium.launch();
  for (const [k, s, n] of jobs) {
    const [w,h] = sizes[s];
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto('file://' + path.join(__dirname, 'creative.html') + `?k=${k}&s=${s}`, { waitUntil: 'networkidle' }).catch(()=>{});
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);
    const file = n.startsWith('carousel') ? `carousel/${n}.png` : `${names[k]}-${n.split('-')[1]}.png`;
    await p.locator('#c').screenshot({ path: path.join(out, file) });
    console.log(file);
    await p.close();
  }
  await b.close();
})();
