import { FileScanIcon, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import type { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { generateBookData } from "@/lib/actions/ai";
import { compressImageFile, fileToBase64 } from "@/lib/utils";
import type { bookSchema } from "@/lib/validation/schemas";
import { FileArea } from "../file-area";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

const MAX_SCAN_IMAGE_BYTES = 3 * 1024 * 1024;
const SCAN_IMAGE_COMPRESSION_STEPS = [
  { maxWidth: 1280, maxHeight: 1280, quality: 0.72 },
  { maxWidth: 1100, maxHeight: 1100, quality: 0.64 },
  { maxWidth: 900, maxHeight: 900, quality: 0.56 },
];

const formatMB = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)}МБ`;

async function prepareScanImage(file: File) {
  const compressedImages = await Promise.all(
    SCAN_IMAGE_COMPRESSION_STEPS.map((options) =>
      compressImageFile(file, {
        ...options,
        preferOriginalBelowBytes: 0,
      }),
    ),
  );

  return (
    compressedImages.find((image) => image.size <= MAX_SCAN_IMAGE_BYTES) ??
    compressedImages.at(-1) ??
    file
  );
}

export function ScanDialog({
  open,
  setOpen,
  reset,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  reset: ReturnType<typeof useForm<z.input<typeof bookSchema>>>["reset"];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Awaited<
    ReturnType<typeof generateBookData>
  > | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileScanIcon /> Отсканировать книгу
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отсканировать книгу</DialogTitle>
          <DialogDescription>
            Сфотографируйте и прикрепите первую страницу книги (со всей
            информацией о ней).
          </DialogDescription>
        </DialogHeader>
        <FileArea
          isLoading={isLoading}
          onSubmit={async (file) => {
            setIsLoading(true);
            try {
              const compressed = await prepareScanImage(file);
              if (compressed.size > MAX_SCAN_IMAGE_BYTES) {
                toast.error(
                  `Не удалось сжать изображение меньше ${formatMB(MAX_SCAN_IMAGE_BYTES)}. Попробуйте обрезать фото.`,
                );
                return;
              }

              if (compressed.size < file.size) {
                toast.info(
                  `Изображение сжато: ${formatMB(file.size)} → ${formatMB(compressed.size)}`,
                );
              }

              const b64 = await fileToBase64(compressed);
              const result = await generateBookData(b64);
              if (!result?.book) {
                toast.error("Не удалось извлечь информацию о книге.");
              }
              setData(result);
            } catch {
              toast.error("Не удалось отсканировать книгу.");
            } finally {
              setIsLoading(false);
            }
          }}
          maxMB={20}
        />
        {data !== null && data?.book !== null && (
          <>
            <div className="overflow-hidden rounded-md border bg-background">
              <Table>
                <TableBody>
                  <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                    <TableCell className="bg-muted/50 py-2 font-medium">
                      Название
                    </TableCell>
                    <TableCell className="py-2">{data.book.title}</TableCell>
                  </TableRow>
                  <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                    <TableCell className="bg-muted/50 py-2 font-medium">
                      Автор
                    </TableCell>
                    <TableCell className="py-2">{data.book.author}</TableCell>
                  </TableRow>
                  <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                    <TableCell className="bg-muted/50 py-2 font-medium">
                      Кол-во страниц
                    </TableCell>
                    <TableCell className="py-2">{data.book.pages}</TableCell>
                  </TableRow>
                  <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                    <TableCell className="bg-muted/50 py-2 font-medium">
                      Издательство
                    </TableCell>
                    <TableCell className="py-2">
                      {data.book.publisher}
                    </TableCell>
                  </TableRow>
                  <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                    <TableCell className="bg-muted/50 py-2 font-medium">
                      Год издания
                    </TableCell>
                    <TableCell className="py-2">
                      {data.book.releaseYear}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            {data.additionalInfo && (
              <div className="rounded-md border px-4 py-3">
                <p className="text-sm">
                  <TriangleAlertIcon
                    aria-hidden="true"
                    className="-mt-0.5 me-3 inline-flex text-amber-500"
                    size={16}
                  />
                  {data.additionalInfo}
                </p>
              </div>
            )}
            <Button
              className="ml-auto"
              onClick={() => {
                if (!data.book || !data) return;
                const { book } = data;
                setOpen(false);
                reset({
                  title: book.title,
                  author: book.author,
                  pages: book.pages,
                  fields: [
                    {
                      title: "Год издания",
                      value: book.releaseYear.toString(),
                    },
                    {
                      title: "Издательство",
                      value: book.publisher,
                    },
                  ],
                });
              }}
            >
              Заполнить информацию
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
