export async function login(page, form): Promise<void> {
  try {
    await page.type('#tpemail', form.username);
    await page.type('#tppassword', form.password);

    await page.click('#btnlogin');
  } catch (err) {
    console.log('err form', err);
  }
}

export async function startWithUrl(
  puppeteer,
  url: string,
  options: { debug?: boolean }
) {
  try {
    const browser = await puppeteer.launch({
      headless: !options.debug
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

export async function addTimeButton(page, dayOfTheWeek: number): Promise<void> {
  try {
    const links = await page.$$('div.timeline-additem');
    const link = links[dayOfTheWeek - 1];
    await page.evaluate(link => link.click(), link);
  } catch (err) {
    console.log('err adding time');
  }
}

async function fillInput(page, options): Promise<void> {
  try {
    await page.evaluate(
      (selector, time) => {
        const elements = [...document.getElementsByClassName(selector)];

        const filteredElements: any[] = elements.filter(elem => {
          return elem.clientHeight !== 0;
        });

        filteredElements[0].value = time;
      },
      options.selector,
      options.time
    );
  } catch (err) {
    console.log('err filling input', err);
  }
}

export async function fillInputs(page, options): Promise<void> {
  try {
    await fillInput(page, {
      selector: 'timerange-inputstart',
      time: options.time
    });

    await fillInput(page, {
      selector: 'timerange-inputend',
      time: options.timeEnd
    });

    await page.keyboard.press('Enter');
  } catch (err) {
    console.log('err adding time', err);
  }
}

export async function editLastTimeline(page, options): Promise<void> {
  try {
    await page.evaluate(date => {
      const selector = `td[data-date="${date}"] .timeline-item`;
      const elements: any[] = [...document.querySelectorAll(selector)];

      elements[elements.length - 1].click();
    }, options.date);

    await fillInput(page, {
      selector: 'timerange-inputend',
      time: options.time
    });

    await page.keyboard.press('Enter');
  } catch (err) {
    console.log('error editing last timeline');
  }
}
