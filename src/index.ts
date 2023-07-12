const HOURS_IN_WORKING_DAY = 8;
const HOUR_IN_MS = 1000 * 60 * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;

const numberOfWorkDaysByHours = (hours: number) =>
  Math.floor(hours / HOURS_IN_WORKING_DAY);

const getFractalTimeInMS = (hours: number) => HOUR_IN_MS * (hours % 8);

const msToNormalizedDate = (ms: number) => {
  const today = new Date(ms);
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  return today;
};

const isFriday = (date: Date) => date.getDay() === 5;

const startOfDay = (date: number) => {
  const today = msToNormalizedDate(date);
  today.setHours(9);

  return today.valueOf();
};

const endOfDay = (date: number) => {
  const today = msToNormalizedDate(date);
  today.setHours(17);

  return today.valueOf();
};

const addHours = (date: Date, hours: number) =>
  date.valueOf() + hours * HOUR_IN_MS;

const addDays = (date: number, days: number) => date + days * DAY_IN_MS;

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

  return addDays(date.valueOf(), daysToAdd);
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

  if (addHours(startTime, turnAroundTime) <= endOfDay(startTime.valueOf())) {
    return new Date(addHours(startTime, turnAroundTime));
  }

  let endDate = addDayShift(startTime, turnAroundTime);
  let remainingTimeToAdd = getFractalTimeInMS(turnAroundTime);

  if (endDate + remainingTimeToAdd > endOfDay(endDate)) {
    const nextWorkingDayStart = isFriday(new Date(endDate))
      ? startOfDay(addDays(endDate, 3))
      : startOfDay(addDays(endDate, 1));
    remainingTimeToAdd = endDate + remainingTimeToAdd - endOfDay(endDate);
    endDate = nextWorkingDayStart + remainingTimeToAdd;
  } else {
    endDate += remainingTimeToAdd;
  }

  return new Date(endDate);
};
