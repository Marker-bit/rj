"use client";

import { useQueryClient } from "@tanstack/react-query";
import { activeSessionsKey } from "./session-settings";
import { KeyRound, Laptop } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  changePassword,
  signOutOtherSessions,
} from "@/lib/actions/account-security";

export function AccountSecuritySettings() {
  return (
    <>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <KeyRound aria-hidden="true" />
        </ItemMedia>
        <ItemContent className="min-w-0 basis-40">
          <ItemTitle>Пароль</ItemTitle>
          <ItemDescription>
            Для смены пароля понадобится текущий пароль.
          </ItemDescription>
        </ItemContent>
        <ItemActions className="ml-auto">
          <ChangePasswordDialog />
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Laptop aria-hidden="true" />
        </ItemMedia>
        <ItemContent className="min-w-0 basis-40">
          <ItemTitle>Другие сеансы</ItemTitle>
          <ItemDescription>
            Выйдите из аккаунта в остальных браузерах и на других устройствах.
          </ItemDescription>
        </ItemContent>
        <ItemActions className="ml-auto">
          <OtherSessionsDialog />
        </ItemActions>
      </Item>
    </>
  );
}

const passwordFields = [
  {
    name: "currentPassword",
    label: "Текущий пароль",
    autoComplete: "current-password",
  },
  {
    name: "password",
    label: "Новый пароль",
    autoComplete: "new-password",
    minLength: 8,
  },
  {
    name: "confirmPassword",
    label: "Повторите новый пароль",
    autoComplete: "new-password",
    minLength: 8,
  },
];

function ChangePasswordDialog() {
  const queryClient = useQueryClient();
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
        <Button type="button" variant="outline">
          Сменить пароль
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Смена пароля</DialogTitle>
          <DialogDescription>
            После смены пароля другие сеансы завершатся. Этот браузер останется
            в аккаунте.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (pending) return;
            const data = new FormData(event.currentTarget);
            setPending(true);
            setError("");
            try {
              const result = await changePassword({
                currentPassword: data.get("currentPassword"),
                password: data.get("password"),
                confirmPassword: data.get("confirmPassword"),
              });
              if (result.error) {
                setError(result.error);
                return;
              }
              setOpen(false);
              void queryClient.invalidateQueries({
                queryKey: activeSessionsKey,
              });
              toast.success("Пароль изменён");
            } catch {
              setError("Не удалось сменить пароль");
            } finally {
              setPending(false);
            }
          }}
        >
          {passwordFields.map(({ name, label, autoComplete, minLength }) => (
            <div key={name} className="space-y-2">
              <Label htmlFor={`${id}-${name}`}>{label}</Label>
              <Input
                id={`${id}-${name}`}
                type="password"
                name={name}
                autoComplete={autoComplete}
                minLength={minLength}
                required
                readOnly={pending}
              />
            </div>
          ))}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending && <Spinner />}
            Сохранить пароль
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function OtherSessionsDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    try {
      const result = await signOutOtherSessions();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: activeSessionsKey });
      toast.success(
        result.count
          ? "Другие сеансы завершены"
          : "Других активных сеансов нет",
      );
    } catch {
      toast.error("Не удалось завершить другие сеансы");
    } finally {
      setPending(false);
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!pending) setOpen(next);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline">
          Завершить другие
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Завершить другие сеансы?</AlertDialogTitle>
          <AlertDialogDescription>
            На других устройствах понадобится снова войти. Текущий сеанс
            останется активным.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel type="button" disabled={pending}>
            Отмена
          </AlertDialogCancel>
          <Button type="button" onClick={handleConfirm} disabled={pending}>
            {pending && <Spinner />}
            Завершить сеансы
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
