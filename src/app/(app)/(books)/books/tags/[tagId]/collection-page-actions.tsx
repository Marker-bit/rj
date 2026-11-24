"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CollectionEditPopover } from "@/components/dialogs/collections/collection-appearance-editor";
import { DeleteCollectionModal } from "@/components/dialogs/collections/delete-collection-modal";
import { Button } from "@/components/ui/button";

export function CollectionPageActions({
  collection,
}: {
  collection: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    bookCount: number;
  };
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <div className="flex shrink-0 items-center gap-1">
      <CollectionEditPopover collection={collection} />
      <Button
        size="icon"
        variant="ghost"
        className="rounded-md text-destructive"
        aria-label={`Удалить коллекцию «${collection.name}»`}
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 aria-hidden="true" />
      </Button>
      <DeleteCollectionModal
        open={deleteOpen}
        setOpen={setDeleteOpen}
        collection={collection}
        onDeleted={() => {
          void queryClient.invalidateQueries({ queryKey: ["collections"] });
          void queryClient.invalidateQueries({ queryKey: ["books"] });
          router.replace("/books");
        }}
      />
    </div>
  );
}
