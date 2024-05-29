import { toast } from "sonner"

export async function apiFetch(
  url: string,
  options?: RequestInit,
  messages: {
    loading?: string
    success?: string
    error?: string
    errorNoBody?: string
  } = {
    loading: "Подождите...",
    success: "Готово!",
    error: "Произошла ошибка: ",
    errorNoBody: "Произошла ошибка!",
  },
  after?: (data: any) => void
) {
  toast.promise(
    async () => {
      const resp = await fetch(url, options)
      try {
        const data = await resp.json()
        if (!resp.ok) {
          if (data.error) {
            throw new Error(messages.error + data.error)
          } else {
            throw new Error(messages.errorNoBody)
          }
        }
        if (after) after(data)
        return data
      } catch (error) {
        throw new Error(messages.errorNoBody)
      }
    },
    {
      loading: messages.loading,
      success: messages.success,
      error: (e: Error) => e.message,
    }
  )
}
