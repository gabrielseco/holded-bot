export interface RoutesObject {
  LOGIN: string;
  TRACKING: string;
  SAVE_TIME: string;
}

export const Routes = ({ business }): RoutesObject => ({
  LOGIN: `https://app.holded.com/tp/login/${business}`,
  TRACKING: 'https://app.holded.com/tp/timetracking',
  SAVE_TIME: 'https://app.holded.com/tp/timetracking/entries/save'
});
