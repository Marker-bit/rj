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
import { Book } from "@/lib/api-types";
import { CheckIcon, CopyIcon, LinkIcon, Settings, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { DialogHeader, DialogTitle } from "../../ui/dialog";
import { Loader } from "../../ui/loader";

export function ShareBookModal({
  open,
  setOpen,
  book,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  book: Book;
}) {
  const [copyLink, setCopyLink] = useState<string>();
  // const [link, setLink] = useState("");
  // useEffect(() => {
  //   setLink(`${window.location.origin}/books/${book.id}`);
  // }, [book.id]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const createLink = async () => {
    setLoading(true);
    const resp = await fetch(`/api/books/${book.id}/links`, {
      method: "POST",
    });
    const res = await resp.json();
    if (resp.ok) {
      setLoading(false);
      router.refresh();
    } else {
      toast.error("Возникла проблема при создании ссылки", {
        description: res.error,
      });
    }
  };

  const deleteLink = async (id: string) => {
    toast.promise(
      async () => {
        setLoading(true);
        const resp = await deleteBookLink(id);
        setLoading(false);
        router.refresh();
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
                  readOnly
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Copy"
                    title="Copy"
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
                onClick={() => deleteLink(link.id)}
                disabled={loading}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <Trash className="size-4" />
              </Button>
              <Button
                onClick={() => toast.info("В разработке")}
                disabled={loading}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <Settings className="size-4" />
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
