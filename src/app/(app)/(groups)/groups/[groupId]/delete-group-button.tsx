"use client";

import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteGroupButton({ groupId }: { groupId: string }) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const router = useRouter();

  const deleteGroup = () => {
    setLoading(true);

    fetch(`/api/groups/${groupId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (res.error) {
          toast.error("Возникла проблема при удалении группы", {
            description: res.error,
          });
        } else {
          toast.success(res.message);
          setConfirmOpen(false);
          router.push("/");
        }
      });
  };

  return (
    <>
      <DrawerDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        className="min-w-[50vw]"
      >
        <DialogHeader className="mb-2">
          <DialogTitle>Удалить группу</DialogTitle>
        </DialogHeader>
        <p>Вы уверены, что хотите удалить группу? Это действие необратимо.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={deleteGroup}
          >
            {loading ? (
              <Loader white className="size-4" />
            ) : (
              <Trash className="size-4" />
            )}
            <p className="max-sm:hidden">Удалить</p>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setConfirmOpen(false)}
          >
            Отмена
          </Button>
        </div>
      </DrawerDialog>
      <Button
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
