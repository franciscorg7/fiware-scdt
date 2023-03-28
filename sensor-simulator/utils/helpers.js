/**
 * Helper that generates the YYYY-MM-DD format string dates for today and tomorrow
 *
 * @returns object with string dates from today and tomorrow
 */
const getTodayTomorrowStringDates = () => {
  const parsedToday = new Date().toISOString().slice(0, 10);
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const parsedTomorrow = tomorrow.toISOString().slice(0, 10);

  return { parsedToday, parsedTomorrow };
};

export default { getTodayTomorrowStringDates };
