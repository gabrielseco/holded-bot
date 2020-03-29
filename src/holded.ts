import puppeteer from 'puppeteer';
import { DateTime } from 'luxon';
import { login, startWithUrl } from './puppetter';
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
      .plus({ hour: 1 })
      .toLocaleString(DateTime.TIME_SIMPLE);
    console.log({ time, timeEnd });

    login(page, {
      username: 'gabriel@streamloots.com',
      password: 'yZZ1X1$r2#N3'
    });
    await page.waitForNavigation();

    page.goto(routes.TRACKING);

    await page.waitForNavigation();

    const links = await page.$$('div.timeline-additem');
    const link = links[dayOfTheWeek - 1];
    await page.evaluate(link => link.click(), link);

    //await browser.close();
  } catch (error) {
    console.log(error);
  }
}

export async function holded(args: HoldedArgs) {
  if (args.start) {
    startWork();
  }
  if (args.stop) {
    //stopWork();
  }
}
