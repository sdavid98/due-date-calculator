const HOURS_IN_WORKING_DAY = 8;
const HOUR_IN_MS = 1000 * 60 * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;
const TIME_BETWEEN_WORKDAYS_IN_MS = 16 * HOUR_IN_MS;

const numberOfWorkDaysByHours = (hours: number) =>
  Math.floor(hours / HOURS_IN_WORKING_DAY);

const getFractalTimeInMS = (hours: number) => HOUR_IN_MS * (hours % 8);

const endOfDay = (initial: Date) => {
  const date = new Date(initial);

  date.setHours(17);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date.valueOf();
};

const addTime = (date: Date, ms: number) => new Date(date.valueOf() + ms);

const addDays = (date: Date, days: number) => addTime(date, days * DAY_IN_MS);

const addDayShift = (date: Date, hours: number) => {
  let daysToAdd = numberOfWorkDaysByHours(hours);
  let addedWeekendDays = 0;
  let weekDayOffset = date.getDay();
  let run = true;

  while (run) {
    const totalDayDiff = weekDayOffset + daysToAdd;
    const totalWeekendDays = Math.floor(totalDayDiff / 6) * 2;
    const newWeekendDays = Math.max(totalWeekendDays - addedWeekendDays, 0);

    daysToAdd += newWeekendDays;
    addedWeekendDays += newWeekendDays;
    weekDayOffset = 0;

    if (newWeekendDays === 0) {
      run = false;
    }
  }

  return addDays(date, daysToAdd);
};

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

  const remainingTimeToAdd = getFractalTimeInMS(turnAroundTime);
  const endDate = addTime(
    addDayShift(startTime, turnAroundTime),
    remainingTimeToAdd,
  );

  if (endDate.valueOf() > endOfDay(endDate)) {
    return addTime(endDate, TIME_BETWEEN_WORKDAYS_IN_MS);
  }

  return endDate;
};
