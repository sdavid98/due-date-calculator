console.log('Hello world!');

const HOURS_IN_WORKING_DAY = 8;
const HOUR_IN_MS = 1000 * 60 * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;

const numberOfWorkDaysByHours = (hours: number) =>
  Math.floor(hours / HOURS_IN_WORKING_DAY);

const endOfDay = (date: Date) => {
  const today = new Date(date.valueOf());
  today.setHours(17);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  return today.valueOf();
};

const addHours = (date: Date, hours: number) =>
  date.valueOf() + hours * HOUR_IN_MS;

export const calculateDueDate = (
  submittedAt: string,
  turnAroundTime: number,
) => {
  if (isNaN(new Date(submittedAt)?.getTime())) {
    throw 'Submit date is not a date!';
  }

  const startTime = new Date(submittedAt);

  if (!turnAroundTime) {
    return startTime;
  }

  if (addHours(startTime, turnAroundTime) <= endOfDay(startTime)) {
    return new Date(addHours(startTime, turnAroundTime));
  }
};
