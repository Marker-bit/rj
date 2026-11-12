import { formatRelative, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";

export function dateToString(date: Date, onlyDate?: boolean) {
  if (onlyDate) {
    return formatRelative(startOfDay(date), new Date(), {
      locale: ru,
    }).replace(" в 0:00", "");
  }
  if (
    date.getHours() === 23 &&
    date.getMinutes() === 59 &&
    date.getSeconds() === 59
  ) {
    return formatRelative(date, new Date(), {
      locale: ru,
    }).replace(" в 23:59", "");
  }
  return formatRelative(date, new Date(), {
    locale: ru,
  });
}
