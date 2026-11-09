"use client";

import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Loader } from "@/components/ui/loader";

export function DeleteGroupButton({ groupId }: { groupId: string }) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const router = useRouter();

  const deleteGroup = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Group deletion failed");
      const result = z
        .object({ message: z.string().min(1) })
        .parse(await response.json());
      toast.success(result.message);
      setConfirmOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Возникла проблема при удалении группы", {
        description: "Попробуйте ещё раз.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DrawerDialog
        open={confirmOpen}
        onOpenChange={(value) => {
          if (!loading) setConfirmOpen(value);
        }}
        className="min-w-[50vw]"
      >
        <DialogHeader className="mb-2">
          <DialogTitle>Удалить группу</DialogTitle>
        </DialogHeader>
        <p>Вы уверены, что хотите удалить группу? Это действие необратимо.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            aria-label="Удалить группу"
            disabled={loading}
            variant="destructive"
            className="flex items-center gap-2"
            onClick={deleteGroup}
          >
            {loading ? (
              <Loader white className="size-4" />
            ) : (
              <Trash className="size-4" />
            )}
            <p>Удалить</p>
          </Button>
          <Button
            variant="outline"
            disabled={loading}
            className="flex items-center gap-2"
            onClick={() => setConfirmOpen(false)}
          >
            Отмена
          </Button>
        </div>
      </DrawerDialog>
      <Button
        aria-label="Удалить группу"
        variant="outline"
        className="flex items-center gap-2"
        disabled={loading}
        onClick={() => setConfirmOpen(true)}
      >
        {loading ? <Loader className="size-4" /> : <Trash className="size-4" />}
        <p className="max-sm:hidden">Удалить</p>
      </Button>
    </>
  );
}
