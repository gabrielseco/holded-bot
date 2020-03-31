import puppeteer from 'puppeteer';
import { DateTime } from 'luxon';
import {
  login,
  startWithUrl,
  addTimeButton,
  fillInputs,
  editLastTimeline
} from './puppetter';

export interface HoldedArgs {
  start: boolean;
  stop: boolean;
}

export interface AccountArgs {
  email: string;
  password: string;
}

export async function startWork(account: AccountArgs, routes): Promise<any> {
  try {
    const url = routes.LOGIN;
    const { page, browser } = await startWithUrl(puppeteer, url);
    const dayOfTheWeek = DateTime.local().weekday;

    const time = DateTime.local().toLocaleString(DateTime.TIME_SIMPLE);
    const timeEnd = DateTime.local()
      .plus({ minutes: 30 })
      .toLocaleString(DateTime.TIME_SIMPLE);

    login(page, {
      username: account.email,
      password: account.password
    });

    await page.waitForNavigation();

    await page.goto(routes.TRACKING);

    await addTimeButton(page, dayOfTheWeek);

    await fillInputs(page, {
      time,
      timeEnd
    });

    //await browser.close();

    console.log(`Start work at ${time}`);
  } catch (error) {
    console.log(error);
  }
}

export async function stopWork(account: AccountArgs, routes) {
  const url = routes.LOGIN;
  const { page, browser } = await startWithUrl(puppeteer, url);
  const time = DateTime.local().toLocaleString(DateTime.TIME_SIMPLE);
  const date = DateTime.local().toFormat('dd-MM-yyyy');

  login(page, {
    username: account.email,
    password: account.password
  });

  await page.waitForNavigation();

  await page.goto(routes.TRACKING);

  await editLastTimeline(page, { date, time });

  await browser.close();

  console.log(`Stopped work at ${time}`);
}
