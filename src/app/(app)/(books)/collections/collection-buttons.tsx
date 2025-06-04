"use client";

import { DeleteCollectionModal } from "@/components/dialogs/collections/delete-collection-modal";
import { Button } from "@/components/ui/button";
import { Book, Collection } from "@prisma/client";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function CollectionButtons({
  collection,
}: {
  collection: Collection & { books: Book[] };
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  return (
    <>
      <DeleteCollectionModal
        collection={collection}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
      <div className="flex items-center gap-2">
        <Link href={`/collections/${collection.id}`}>
          <Button variant="outline" className="gap-2">
            <Pencil className="size-4" />
            <div className="max-sm:hidden">Редактировать</div>
          </Button>
        </Link>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash className="size-4" />
          <div className="max-sm:hidden">Удалить</div>
        </Button>
      </div>
    </>
  );
}
