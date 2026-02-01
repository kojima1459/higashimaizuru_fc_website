import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('https://3000-ibhup0uojbhawmlrn4iha-3f4b06bf.sg1.manus.computer', {
    waitUntil: 'networkidle2'
  });
  
  // スクロールして「Jrから大人まで」セクションを表示
  await page.evaluate(() => {
    window.scrollTo(0, 1800);
  });
  
  await page.waitForTimeout(1000);
  
  await page.screenshot({ 
    path: '/home/ubuntu/jr_section_screenshot.png',
    fullPage: false
  });
  
  await browser.close();
  console.log('Screenshot saved to /home/ubuntu/jr_section_screenshot.png');
})();
