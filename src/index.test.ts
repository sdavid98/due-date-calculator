import { calculateDueDate } from '.';

describe('calculateDueDate', () => {
  test('should throw error if start date is not a valid date', () => {
    expect(() => calculateDueDate('not-a-valid-date', 1)).toThrow(
      'Submit date is not a date!',
    );
  });

  test('calculates same-day due dates correctly', async () => {
    const startTime = '2023-07-12 12:34:56';
    const turnAroundTime = 3;
    const expected = new Date('2023-07-12 15:34:56');
    const result = calculateDueDate(startTime, turnAroundTime);
    expect(result).toEqual(expected);
  });
});

describe('Timezones', () => {
  it('should always be UTC', () => {
    expect(new Date().getTimezoneOffset()).toBe(0);
  });
});
