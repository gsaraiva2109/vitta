/**
 * Calculates the next maintenance date by adding a specified number of months to a start date.
 * @param {Date} startDate The date from which to calculate the next maintenance.
 * @param {number} intervalInMonths The number of months to add.
 * @returns {Date} The calculated next maintenance date.
 */
export function calculateNextMaintenanceDate(startDate, intervalInMonths) {
  const nextDate = new Date(startDate);
  nextDate.setMonth(nextDate.getMonth() + intervalInMonths);
  return nextDate;
}
