"use client";

import { KeyRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { setPassword } from "@/lib/actions/users";
import { revalidate } from "@/lib/actions/revalidate";

export default function PasswordUpdateButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [password, setPasswordState] = useState("");

  const changePassword = async () => {
    toast.promise(
      async () => {
        setLoading(true);
        await setPassword(userId, password);
        setLoading(false);
        void revalidate("admin");
      },
      {
        loading: "Подождите...",
        success: "Подтверждение задано",
        error: "Не удалось задать подтверждение",
      },
    );
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <KeyRound />
          Сменить пароль
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Card>
          <CardHeader>
            <CardTitle>Сменить пароль</CardTitle>
            <CardDescription>
              Вы можете изменить пароль этому пользователю.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Input
              type="password"
              placeholder="Новый пароль"
              value={password}
              onChange={(e) => setPasswordState(e.target.value)}
            />
            <Button onClick={changePassword} disabled={loading}>
              Сменить пароль
            </Button>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
