"use client";

import { DrawerDialog } from "@/components/drawer";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { CopyCheck, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function ShareBookModal({
  open,
  setOpen,
  book,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  book: Book;
}) {
  const [copyLink, setCopyLink] = useState(false);
  const [link, setLink] = useState("");
  useEffect(() => {
    setLink(`${window.location.origin}/books/${book.id}`);
  }, [book.id]);
  return (
    <DrawerDialog
      open={open}
      onOpenChange={setOpen}
      className="md:w-[50vw] lg:w-[40vw]"
    >
      <DialogHeader>
        <DialogTitle>Поделиться</DialogTitle>
      </DialogHeader>
      <div className="mt-2">
        <div className="flex max-sm:flex-col gap-2 w-full">
          <Input readOnly value={link} className="sm:w-full md:w-[80%]" />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(link);
              setCopyLink(true);
              setTimeout(() => {
                setCopyLink(false);
              }, 2000);
            }}
            variant={copyLink ? "outline" : "default"}
          >
            {copyLink ? (
              <div className="text-green-500 flex items-center gap-2">
                <CopyCheck className="w-4 h-4" />
                <div className="max-sm:hidden">Скопировано</div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CopyIcon className="w-4 h-4" />
                <div className="max-sm:hidden">Скопировать</div>
              </div>
            )}
          </Button>
        </div>
      </div>
    </DrawerDialog>
  );
}
