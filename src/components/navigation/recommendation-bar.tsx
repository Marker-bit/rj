"use client";

import { Recommendation } from "@prisma/client";
import { BookHeartIcon, Router, XIcon } from "lucide-react";
import { use, useEffect, useMemo, useState } from "react";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { Button } from "../ui/button";
import { DrawerDialog } from "../ui/drawer-dialog";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { saveBookFromRec } from "@/lib/actions/books";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RecommendationBar({
  recommendations,
}: {
  recommendations: Promise<Recommendation[] | null>;
}) {
  const recommendationsSync = use(recommendations);
  const [dismissed, setDismissed] = useLocalStorage<string[]>("dismissed", []);
  const disableRecs = useReadLocalStorage("disableRecs");
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const showableRec = useMemo(
    () => recommendationsSync?.find((r) => !dismissed.includes(r.id)),
    [recommendationsSync, dismissed]
  );

  const saveBook = async () => {
    setLoading(true);
    const res = await saveBookFromRec(showableRec!.id);
    if (res?.error) {
      toast.error("Возникла проблема при добавлении книги", {
        description: res.error,
      });
      setLoading(false);
    } else {
      toast.success("Книга успешно добавлена");
      setLoading(false);
      router.refresh();
    }
  };

  if (!recommendationsSync) return null;
  if (!showableRec) return null;
  if (disableRecs) return null;
  if (!isClient) return null;

  return (
    <div className="dark bg-muted text-foreground px-4 py-3">
      <div className="flex gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center">
          <div
            className="bg-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5"
            aria-hidden="true"
          >
            <BookHeartIcon className="opacity-80" size={16} />
          </div>
          <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{showableRec.slogan}</p>
              <p className="text-muted-foreground text-sm">
                &quot;{showableRec.title}&quot; - {showableRec.author}
              </p>
            </div>
            <div className="flex gap-2 max-md:flex-wrap">
              <Button
                size="sm"
                className="text-sm"
                disabled={loading}
                onClick={saveBook}
              >
                Добавить себе
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-sm"
                onClick={() => setOpen(true)}
              >
                Больше информации
              </Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          // onClick={() => setIsVisible(false)}
          aria-label="Закрыть рекомендацию"
          onClick={() => setDismissed([...dismissed, showableRec.id])}
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
        <DrawerDialog open={open} onOpenChange={setOpen}>
          <DialogHeader>
            <DialogTitle>
              {showableRec.title} - {showableRec.author}
            </DialogTitle>
            <DialogDescription>{showableRec.bookInfo}</DialogDescription>
          </DialogHeader>
        </DrawerDialog>
      </div>
    </div>
  );
}
