"use client"

import { X } from "lucide-react"
import Link from "next/link"
import { ReactElement, useEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

export default function Notifications() {
  const notifications = [
    {
      id: "support",
      title: "Вы можете задать вопрос в службе поддержки",
      body: (
        <div className="flex flex-col gap-2">
          <p>
            Вы можете задать вопрос в службе поддержки с помощью кнопки сверху
            справа на главной странице.
          </p>
          <Link
            href="/support"
            className="text-blue-500 underline underline-offset-4"
          >
            Написать в службу поддержки
          </Link>
        </div>
      ),
    },
    {
      id: "telegram",
      title: "Telegram-канал Читательского дневника",
      body: (
        <div className="flex flex-col gap-2">
          <p>
            В этом канале будут публиковаться посты об обновлениях и новостях.
            Подписывайтесь:{" "}
            <Link
              href="https://t.me/rjrjdev"
              className="text-blue-500 underline underline-offset-4"
              target="_blank"
            >
              @rjrjdev
            </Link>
            .
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-2">
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  )
}

function Notification({
  notification,
}: {
  notification: { id: string; title: string; body: ReactElement<any> }
}) {
  const [isClient, setIsClient] = useState(false)
  const [notifications, setNotifications] = useLocalStorage<string[]>(
    "hiddenIds",
    []
  )
  useEffect(() => {
    setIsClient(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hide = () => {
    if (!notifications.includes(notification.id)) {
      setNotifications((notifications) => [...notifications, notification.id])
    }
  }
  if (!isClient) return null
  const hidden = notifications.includes(notification.id)
  if (hidden) return null

  return (
    <div className="relative flex flex-col gap-4 rounded-xl border p-2">
      <div className="text-xl font-bold">{notification.title}</div>
      {notification.body}
      <button
        className="absolute right-2 top-2 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/5"
        onClick={hide}
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
