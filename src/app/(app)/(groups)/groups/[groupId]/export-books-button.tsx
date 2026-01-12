"use client";

import type { GroupBook } from "@prisma/client";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportBooksButton({ books }: { books: GroupBook[] }) {
  const downloadFile = (text: string, filename: string, type: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], {
      type,
    });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const generateJson = () => {
    const readyBooks = books.map((book) => {
      return {
        title: book.title,
        author: book.author,
        pages: book.pages,
        coverUrl: book.coverUrl,
        description: book.description,
      };
    });

    return JSON.stringify(readyBooks);
  };
  const exportClick = () => {
    downloadFile(generateJson(), "groupBooks.json", "application/json");
  };
  return (
    <Button
      size="icon"
      variant="ghost"
      className="size-fit p-1"
      onClick={exportClick}
    >
      <Download className="size-4" />
    </Button>
  );
}
