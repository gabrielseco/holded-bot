export async function login(page, form) {
  try {
    await page.type('#tpemail', form.username);
    await page.type('#tppassword', form.password);

    await page.click('#btnlogin');
  } catch (err) {
    console.log('err form', err);
  }
}

export async function startWithUrl(puppeteer, url: string) {
  try {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    const override = Object.assign(page.viewport(), { width: 1366 });
    await page.setViewport(override);
    await page.goto(url);
    return {
      page,
      browser
    };
  } catch (err) {
    console.log('err launching puppetter');
  }
}
