import { DateTime } from 'luxon';
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

export function getTimes(time?: string): { time: string; timeEnd: string } {
  const FORMAT_TIME = 'HH:mm';
  const outputTime = time || DateTime.local().toFormat(FORMAT_TIME);
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
  routes,
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

    await waitForResponse(
      page,
      'https://app.holded.com/tp/timetracking/entries/save'
    );

    await browser.close();

    console.log(`Start work at ${time}`);
  } catch (error) {
    console.log(error);
  }
}

export async function stopWork(
  account: AccountArgs,
  routes,
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

  await waitForResponse(
    page,
    'https://app.holded.com/tp/timetracking/entries/save'
  );

  await browser.close();

  console.log(`Stopped work at ${time}`);
}
