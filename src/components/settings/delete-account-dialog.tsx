"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { deleteAccount } from "@/lib/actions/account-security";

export function DeleteAccountDialog() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (pending) return;
        setError("");
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="destructive">
          Удалить аккаунт
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Удалить аккаунт навсегда?</DialogTitle>
          <DialogDescription>
            Профиль, личные книги, коллекции и записи журнала будут удалены.
            Группы с другими участниками сохранятся.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (pending) return;
            const password = new FormData(event.currentTarget).get("password");
            setPending(true);
            setError("");
            try {
              const result = await deleteAccount(password);
              if (result.error) {
                setError(result.error);
                setPending(false);
                return;
              }
              window.location.assign("/");
            } catch {
              setError("Не удалось удалить аккаунт. Попробуйте ещё раз.");
              setPending(false);
            }
          }}
        >
          <div className="space-y-2">
            <Label htmlFor={id}>Подтвердите текущим паролем</Label>
            <Input
              id={id}
              name="password"
              type="password"
              autoComplete="current-password"
              required
              readOnly={pending}
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Отмена
            </Button>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending && <Spinner />}
              Удалить навсегда
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
