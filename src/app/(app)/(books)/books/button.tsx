"use client";

import { AddBookDialog } from "@/components/book/book-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AddBookButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center">
        <Button onClick={() => setOpen(true)}>
          <Plus /> Добавить книгу
        </Button>
      </div>
      <AddBookDialog open={open} setOpen={setOpen} />
    </>
  );
}
