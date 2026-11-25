export const START_PAGE_COOKIE = "journal-start-page";

export const startPageLabels = {
  "/home": "Главная",
  "/books": "Книги",
  "/journal": "Журнал",
};

export function parseStartPage(value: string | undefined) {
  return value === "/books" || value === "/journal" ? value : "/home";
}

export function readBrowserStartPage() {
  if (typeof document === "undefined") return "/home";
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(START_PAGE_COOKIE + "="));
  return parseStartPage(cookie?.slice(START_PAGE_COOKIE.length + 1));
}
