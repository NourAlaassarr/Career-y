export const convertNeo4jDatetimeToISO = (datetime) => {
    if (!datetime || !datetime.year || !datetime.month || !datetime.day || !datetime.hour || !datetime.minute || !datetime.second || !datetime.nanosecond) {
        return null;
    }
    return new Date(
        datetime.year.low,
        datetime.month.low - 1, // Month is zero-based
        datetime.day.low,
        datetime.hour.low,
        datetime.minute.low,
        datetime.second.low,
        datetime.nanosecond.low / 1e6 // Convert nanoseconds to milliseconds
    ).toISOString(); // Convert to ISO string for readability
};
