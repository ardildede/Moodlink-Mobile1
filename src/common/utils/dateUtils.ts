/**
 * Formats a date to relative time string based on Turkish locale
 * @param date - Date to format
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = date instanceof Date ? date : new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "Şimdi";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} dakika önce`;
  } else if (diffInHours < 24) {
    return `${diffInHours} saat önce`;
  } else {
    // Format as DD.MM.YYYY
    const day = targetDate.getDate().toString().padStart(2, "0");
    const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
    const year = targetDate.getFullYear();
    return `${day}.${month}.${year}`;
  }
};
