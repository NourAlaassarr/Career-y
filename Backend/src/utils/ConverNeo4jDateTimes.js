export const convertNeo4jDatetimeToISO = (datetime) => {
    if (!datetime) return null;
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