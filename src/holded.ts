import puppeteer from 'puppeteer';
import { DateTime } from 'luxon';
import {
  login,
  startWithUrl,
  addTimeButton,
  fillInputs,
  editLastTimeline
} from './puppetter';
import { Routes } from './routes';

const routes = Routes({ business: 'streamloots' });

export interface HoldedArgs {
  start: boolean;
  stop: boolean;
}

async function startWork(): Promise<any> {
  try {
    const url = routes.LOGIN;
    const { page, browser } = await startWithUrl(puppeteer, url);
    const dayOfTheWeek = DateTime.local().weekday;

    const time = DateTime.local().toLocaleString(DateTime.TIME_SIMPLE);
    const timeEnd = DateTime.local()
      .plus({ hour: 6 })
      .toLocaleString(DateTime.TIME_SIMPLE);

    login(page, {
      username: 'gabriel@streamloots.com',
      password: 'yZZ1X1$r2#N3'
    });

    await page.waitForNavigation();

    await page.goto(routes.TRACKING);

    await addTimeButton(page, dayOfTheWeek);

    await fillInputs(page, {
      time,
      timeEnd
    });

    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

async function stopWork() {
  const url = routes.LOGIN;
  const { page, browser } = await startWithUrl(puppeteer, url);
  const time = DateTime.local().toLocaleString(DateTime.TIME_SIMPLE);
  const date = DateTime.local().toFormat('dd-MM-yyyy');

  login(page, {
    username: 'gabriel@streamloots.com',
    password: 'yZZ1X1$r2#N3'
  });

  await page.waitForNavigation();

  await page.goto(routes.TRACKING);

  await editLastTimeline(page, { date, time });

  await browser.close();
}

export async function holded(args: HoldedArgs) {
  if (args.start) {
    startWork();
  }
  if (args.stop) {
    stopWork();
  }
}
