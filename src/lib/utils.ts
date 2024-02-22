import { type ClassValue, clsx } from "clsx";
import { formatRelative } from "date-fns";
import { ru } from "date-fns/locale";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateToString(date: Date) {
  if (date.getHours() === 0 && date.getMinutes() === 0) {
    return formatRelative(date, new Date(), {
      locale: ru,
    }).replace(" в 0:00", "");
  }
  return formatRelative(date, new Date(), {
    locale: ru,
  });
  const yesterday = moment().subtract(1, "day");
  if (moment(date).isSame(new Date(), "day")) {
    return `Сегодня в ${date.getHours()}:${date.getMinutes()}`;
  } else if (moment(date).isSame(yesterday, "day")) {
    return `Вчера в ${date.getHours()}:${date.getMinutes()}`;
  } else {
    return moment(date).calendar();
  }
  return date.toLocaleString();
}

// export function date(date: Date) {
//   moment.updateLocale("ru", {
//     week: {
//       dow: 1, // Monday is the first day of the week.
//     },
//   });
//   if (moment(date).isSame(new Date(), "day")) {
//     return "Сегодня";
//   }
// }
