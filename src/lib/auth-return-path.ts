export function authReturnPath(value: string | string[] | undefined): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/home";
  }

  if (
    value.includes("\\") ||
    Array.from(value).some((character) => {
      const code = character.charCodeAt(0);
      return code <= 32 || code === 127;
    })
  )
    return "/home";

  const url = new URL(value, "https://local.invalid");
  if (
    url.origin !== "https://local.invalid" ||
    url.pathname.startsWith("//") ||
    url.pathname === "/auth" ||
    url.pathname.startsWith("/auth/")
  ) {
    return "/home";
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

export function authPageHref(
  page: "login" | "register",
  returnTo: string,
): string {
  return `/auth/${page}?${new URLSearchParams({ returnTo })}`;
}
