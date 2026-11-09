import { CheckIcon, CopyIcon, LinkIcon, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { deleteBookLink } from "@/lib/actions/books";
import type { Book } from "@/lib/api-types";
import { Button } from "../../ui/button";
import { DialogHeader, DialogTitle } from "../../ui/dialog";
import { Loader } from "../../ui/loader";
import { revalidate } from "@/lib/actions/revalidate";

export function ShareBookModal({
  open,
  setOpen,
  book,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  book: Book;
}) {
  const [loading, setLoading] = useState(false);
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const createLink = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/books/${book.id}/links`, {
        method: "POST",
      });
      if (!resp.ok) throw new Error("Не удалось создать ссылку");
      void revalidate("books");
    } catch {
      toast.error("Возникла проблема при создании ссылки");
    } finally {
      setLoading(false);
    }
  };

  const deleteLink = async (id: string) => {
    toast.promise(
      async () => {
        setLoading(true);
        await deleteBookLink(id);
        setLoading(false);
        void revalidate("books");
      },
      {
        loading: "Удаление ссылки...",
        success: "Ссылка удалена",
        error: "Возникла проблема при удалении ссылки",
      },
    );
  };

  return (
    <DrawerDialog
      open={open}
      onOpenChange={setOpen}
      className="md:w-[50vw] lg:w-[40vw]"
    >
      <DialogHeader>
        <DialogTitle>Ссылки</DialogTitle>
      </DialogHeader>
      <div className="mt-2">
        <div className="flex flex-col items-stretch gap-2">
          {book.links.map((link) => (
            <div className="flex w-full gap-2 items-center" key={link.id}>
              <InputGroup className="grow">
                <InputGroupInput
                  value={`${
                    typeof window !== "undefined" && window.location.origin
                  }/sharedbook/${link.id}`}
                  aria-label="Ссылка для доступа к книге"
                  readOnly
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Скопировать ссылку"
                    title="Скопировать ссылку"
                    size="icon-xs"
                    onClick={() => {
                      copyToClipboard(
                        `${
                          typeof window !== "undefined" &&
                          window.location.origin
                        }/sharedbook/${link.id}`,
                      );
                    }}
                  >
                    {isCopied ? <CheckIcon /> : <CopyIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <Button
                aria-label="Удалить ссылку"
                title="Удалить ссылку"
                onClick={() => deleteLink(link.id)}
                disabled={loading}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <Trash className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        {book.links.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LinkIcon />
              </EmptyMedia>
              <EmptyTitle>Ссылок ещё нет</EmptyTitle>
              <EmptyDescription>
                Вы ещё не создали ни одной ссылки. Создайте свою первую ссылку.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        <Button
          className="mt-2 w-full items-center gap-2"
          disabled={loading}
          onClick={createLink}
        >
          {loading && <Loader invert className="size-4" />}
          Создать ссылку
        </Button>
      </div>
    </DrawerDialog>
  );
}
