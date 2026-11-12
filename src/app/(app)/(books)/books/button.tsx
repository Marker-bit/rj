"use client";

import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const AddBookDialog = dynamic(
  () => import("@/components/book/book-form").then((mod) => mod.AddBookDialog),
  { ssr: false },
);

export default function AddBookButton() {
  const [open, setOpen] = useState(false);
  const [dialogMounted, setDialogMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setDialogMounted(true);
    }
  }, [open]);

  return (
    <>
      <div className="flex items-center">
        <Button onClick={() => setOpen(true)}>
          <Plus /> Добавить книгу
        </Button>
      </div>
      {dialogMounted && <AddBookDialog open={open} setOpen={setOpen} />}
    </>
  );
}
