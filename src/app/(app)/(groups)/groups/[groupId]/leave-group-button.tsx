"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
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
import { Loader } from "@/components/ui/loader";

export function LeaveGroupButton({ groupId }: { groupId: string }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const leaveGroup = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/leave`, {
        method: "POST",
      });
      const result: unknown = await response.json();
      const failure = z.object({ error: z.string().min(1) }).safeParse(result);
      if (failure.success) throw new Error(failure.data.error);
      if (!response.ok) throw new Error("Попробуйте ещё раз.");
      const success = z.object({ message: z.string().min(1) }).parse(result);
      toast.success(success.message);
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Возникла проблема при выходе", {
        description:
          error instanceof Error &&
          !(error instanceof z.ZodError) &&
          !(error instanceof SyntaxError) &&
          !(error instanceof TypeError)
            ? error.message
            : "Не удалось выйти из группы. Попробуйте ещё раз.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!loading) setOpen(value);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          aria-label="Выйти из группы"
          variant="outline"
          className="flex items-center gap-2"
          disabled={loading}
        >
          <LogOut className="size-4" />
          <p className="max-sm:hidden">Выйти</p>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Выйти из группы?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы потеряете доступ к книгам и записям группы. Чтобы вернуться,
            попросите участника добавить вас или прислать ссылку.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Отмена</AlertDialogCancel>
          <Button variant="destructive" disabled={loading} onClick={leaveGroup}>
            {loading && <Loader white className="size-4" />}
            Выйти из группы
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
