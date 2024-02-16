export const validateRequest = async () => {
  const resp = await fetch("/api/auth/session");
  const data = await resp.json();

  return data;
};
