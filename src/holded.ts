import { DateTime } from 'luxon';
import { RoutesObject } from './routes';
import {
  login,
  startWithUrl,
  addTimeButton,
  fillInputs,
  editLastTimeline,
  waitForResponse
} from './puppetter';

interface AccountArgs {
  email: string;
  password: string;
}

interface CliArgs {
  debug?: boolean;
  time?: string;
}

function formatTime(time?: string): string {
  const [hour, minutes] = time.split(':');

  if (hour.length === 1 && parseInt(hour, 10) < 10) {
    return `0${hour}:${minutes}`;
  }

  return time;
}

export function getTimes(time?: string): { time: string; timeEnd: string } {
  const FORMAT_TIME = 'HH:mm';
  const formattedTime = time ? formatTime(time) : time;
  const outputTime = formattedTime || DateTime.local().toFormat(FORMAT_TIME);
  const timeEnd = DateTime.fromISO(outputTime)
    .plus({ minutes: 30 })
    .toFormat(FORMAT_TIME);

  return {
    time: outputTime,
    timeEnd
  };
}

export async function startWork(
  account: AccountArgs,
  routes: RoutesObject,
  args: CliArgs
): Promise<void> {
  try {
    const url = routes.LOGIN;
    const { page, browser } = await startWithUrl(url, args);
    const dayOfTheWeek = DateTime.local().weekday;
    const { time, timeEnd } = getTimes(args.time);

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

    await waitForResponse(page, routes.SAVE_TIME);

    await browser.close();

    console.log(`Start work at ${time}`);
  } catch (error) {
    console.log(error);
  }
}

export async function stopWork(
  account: AccountArgs,
  routes: RoutesObject,
  args: CliArgs
): Promise<void> {
  const url = routes.LOGIN;
  const { page, browser } = await startWithUrl(url, args);
  const { time } = getTimes(args.time);
  const date = DateTime.local().toFormat('dd-MM-yyyy');

  login(page, {
    username: account.email,
    password: account.password
  });

  await page.waitForNavigation();

  await page.goto(routes.TRACKING);

  await editLastTimeline(page, { date, time });

  await waitForResponse(page, routes.SAVE_TIME);

  await browser.close();

  console.log(`Stopped work at ${time}`);
}
