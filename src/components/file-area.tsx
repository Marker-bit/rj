import { BanIcon, ImageUpIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export function FileArea({
  maxMB,
  onSubmit,
  isLoading,
}: {
  maxMB: number;
  onSubmit: (file: File) => void;
  isLoading: boolean;
}) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<
    "false" | "allowed" | "not-allowed"
  >("false");

  const openFilePicker = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = () => {
      if (!input.files || input.files.length !== 1) {
        toast.error("Выберите ровно 1 файл");
        return;
      }
      if (
        !Array.from(input.files)
          .map((a) => a.type.startsWith("image/"))
          .every(Boolean)
      ) {
        toast.error("Выберите изображение");
        return;
      }
      onSubmit(input.files[0]);
    };
    input.click();
  };

  return (
    <div
      className="rounded-lg h-40 w-full flex flex-col border items-center justify-center data-[dragging]:border-blue-500 data-[dragging]:text-blue-500 data-[dragging]:border-dashed data-[dragging]:border-2 data-[notallowed]:text-red-500 data-[notallowed]:border-red-500 select-none data-[active]:cursor-pointer data-[active]:hover:bg-accent/20 transition-[background-color]"
      ref={areaRef}
      role="button"
      onClick={openFilePicker}
      onDragEnter={(e) => {
        if (isLoading) return;
        e.preventDefault();
        e.stopPropagation();

        setIsDragging("allowed");
      }}
      onDragOver={(e) => {
        if (isLoading) return;
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        if (isLoading) return;
        e.preventDefault();
        e.stopPropagation();

        if (e.currentTarget.contains(e.relatedTarget as Node)) {
          return;
        }
        setIsDragging("false");
      }}
      onDrop={async (e) => {
        if (isLoading) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging("false");
        if (e.dataTransfer.files.length !== 1) {
          toast.error("Перетяните ровно 1 файл");
          return;
        }
        if (
          !Array.from(e.dataTransfer.files)
            .map((a) => a.type.startsWith("image/"))
            .every(Boolean)
        ) {
          toast.error("Перетяните изображение");
          return;
        }
        onSubmit(e.dataTransfer.files[0]);
      }}
      data-dragging={isDragging === "allowed" || undefined}
      data-notallowed={isDragging === "not-allowed" || undefined}
      data-active={!isLoading || undefined}
    >
      <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
        <div
          className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
          aria-hidden="true"
        >
          {isLoading ? (
            <Spinner className="size-4" />
          ) : isDragging === "not-allowed" ? (
            <BanIcon className="size-4" />
          ) : isDragging === "allowed" ? (
            <ImageUpIcon className="size-4" />
          ) : (
            <ImageUpIcon className="size-4 opacity-60" />
          )}
        </div>
        <p className="mb-1.5 text-sm font-semibold">
          {isLoading
            ? "Загрузка..."
            : "Перетяните картинку сюда или нажмите чтобы выбрать"}
        </p>
        {!isLoading && (
          <p className="text-xs opacity-60">Максимальный размер: {maxMB}МБ</p>
        )}
      </div>
    </div>
  );
}
