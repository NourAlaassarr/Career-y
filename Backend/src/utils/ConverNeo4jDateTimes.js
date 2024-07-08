// export const convertNeo4jDatetimeToISO = (datetime) => {
//     if (!datetime || !datetime.year || !datetime.month || !datetime.day || !datetime.hour || !datetime.minute || !datetime.second || !datetime.nanosecond) {
//         return null;
//     }
//     return new Date(
//         datetime.year.low,
//         datetime.month.low - 1, // Month is zero-based
//         datetime.day.low,
//         datetime.hour.low,
//         datetime.minute.low,
//         datetime.second.low,
//         datetime.nanosecond.low / 1e6 // Convert nanoseconds to milliseconds
//     ).toISOString(); // Convert to ISO string for readability
// };
export const convertNeo4jDateToISO = (date) => {
    if (!date || !date.year || !date.month || !date.day) {
        return null;
    }
    const year = date.year.low !== undefined ? date.year.low : date.year;
    const month = (date.month.low !== undefined ? date.month.low : date.month) - 1; // Month is zero-based
    const day = date.day.low !== undefined ? date.day.low : date.day;
    return new Date(year, month, day).toISOString().split('T')[0]; // Convert to ISO string and keep only the date part
};

export const convertStringToISO = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toISOString();
};

export const convertNeo4jDatetimeToISO = (datetime) => {
    if (!datetime) return null;

    // If datetime is already a string, return it as is
    if (typeof datetime === 'string') {
        return datetime;
    }

    // Check for the presence of the low properties
    if (!datetime.year || !datetime.month || !datetime.day || !datetime.hour || !datetime.minute || !datetime.second || !datetime.nanosecond) {
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
