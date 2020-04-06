import { Settings } from 'luxon';

import { getTimes } from './holded';

describe('GetTimes', () => {
  describe('with date mocked', () => {
    beforeEach(() => {
      Settings.now = () => new Date(2020, 3, 6, 9, 0, 0).valueOf();
    });
    afterEach(() => {
      Settings.now = () => new Date().valueOf();
    });

    it('should return the time right now and the timeEnd thirty minutes later', () => {
      const { time, timeEnd } = getTimes();

      expect(time).toBe('09:00');
      expect(timeEnd).toBe('09:30');
    });
  });
});

describe('Without having dates mocked', () => {
  it('should return the time right now and the timeEnd thirty minutes later', () => {
    const { time, timeEnd } = getTimes('10:00');

    expect(time).toBe('10:00');
    expect(timeEnd).toBe('10:30');
  });
});
