"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucia"
import { ChevronsUpDown, LogOut, Settings, UserIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function UserButton({ user }: { user: User }) {
  const router = useRouter()

  const logOut = () => {
    toast.promise(
      async () => {
        await fetch("/api/auth/", {
          method: "DELETE",
        })
        router.push("/")
      },
      {
        loading: "Выход...",
        success: "Вы вышли из аккаунта",
        error: (error) => `Возникла проблема при выходе: ${error.message}`,
      }
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex justify-between gap-2">
          <Image
            className="size-8 rounded-full"
            src={user.avatarUrl || "/no-avatar.png"}
            alt="avatar"
            width={32}
            height={32}
          />
          @{user.username}
          <ChevronsUpDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href="/profile">
          <DropdownMenuItem>
            <UserIcon className="mr-2 size-4" /> Профиль
          </DropdownMenuItem>
        </Link>
        <Link href="/profile/settings">
          <DropdownMenuItem>
            <Settings className="mr-2 size-4" /> Настройки
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={logOut}>
          <LogOut className="mr-2 size-4" /> Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
