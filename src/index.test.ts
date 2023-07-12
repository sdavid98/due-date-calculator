import { calculateDueDate } from '.';

describe('calculateDueDate', () => {
  test('should throw error if start date is not a valid date', () => {
    expect(() => calculateDueDate('not-a-valid-date', 1)).toThrow(
      'Submit date is not a date!',
    );
  });

  test('return start time if turn-around time is 0', () => {
    const startTime = '2023-07-12 12:34:56';
    const turnAroundTime = 0;
    const expected = new Date(startTime);
    const result = calculateDueDate(startTime, turnAroundTime);
    expect(result).toEqual(expected);
  });

  test('calculates same-day due dates correctly', async () => {
    const startTime = '2023-07-12 12:34:56';
    const turnAroundTime = 3;
    const expected = new Date('2023-07-12 15:34:56');
    const result = calculateDueDate(startTime, turnAroundTime);
    expect(result).toEqual(expected);
  });

  test.each<[string, number, string]>([
    ['2023-07-12 12:34:56', 5, '2023-07-13 09:34:56'],
    ['2023-07-12 12:34:56', 10, '2023-07-13 14:34:56'],
    ['2023-07-12 12:34:56', 80, '2023-07-26 12:34:56'],
    ['2023-07-12 12:34:56', 85, '2023-07-27 09:34:56'],
    ['2023-07-12 12:34:56', 200, '2023-08-16 12:34:56'],
    ['2023-07-12 12:34:56', 202, '2023-08-16 14:34:56'],
    ['2023-07-12 12:34:56', 206, '2023-08-17 10:34:56'],
  ])(
    'should calculate correct due dates across workdays and weekends',
    (startTime, turnAroundTime, expected) => {
      const expectedDate = new Date(expected);
      const result = calculateDueDate(startTime, turnAroundTime);
      expect(result).toEqual(expectedDate);
    },
  );
});

describe('Timezones', () => {
  it('should always be UTC', () => {
    expect(new Date().getTimezoneOffset()).toBe(0);
  });
});
