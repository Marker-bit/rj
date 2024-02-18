import { type ClassValue, clsx } from "clsx"
import moment from "moment";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
