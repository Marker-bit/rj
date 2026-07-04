import { BanIcon, ImageUpIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { motion, AnimatePresence } from "motion/react";

export function FileArea({
  maxMB,
  onSubmit,
  isLoading,
  loadingStatus,
}: {
  maxMB: number;
  onSubmit: (file: File) => void;
  isLoading: boolean;
  loadingStatus?: string;
}) {
  const areaRef = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState<
    "false" | "allowed" | "not-allowed"
  >("false");

  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Выберите изображение");
      return false;
    }

    if (file.size > maxMB * 1024 * 1024) {
      toast.error(`Размер файла должен быть не больше ${maxMB}МБ`);
      return false;
    }

    return true;
  };

  const openFilePicker = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      if (!input.files || input.files.length !== 1) {
        toast.error("Выберите ровно 1 файл");
        return;
      }

      const file = input.files[0];
      if (!validateFile(file)) {
        return;
      }

      onSubmit(file);
    };
    input.click();
  };

  return (
    <button
      type="button"
      className="rounded-lg h-40 w-full flex flex-col border items-center justify-center data-[dragging]:border-blue-500 data-[dragging]:text-blue-500 data-[dragging]:border-dashed data-[dragging]:border-2 data-[notallowed]:text-red-500 data-[notallowed]:border-red-500 select-none data-[active]:cursor-pointer data-[active]:hover:bg-accent/20 transition-[background-color]"
      ref={areaRef}
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
        const file = e.dataTransfer.files[0];
        if (!validateFile(file)) {
          return;
        }

        onSubmit(file);
      }}
      data-dragging={isDragging === "allowed" || undefined}
      data-notallowed={isDragging === "not-allowed" || undefined}
      data-active={!isLoading || undefined}
      disabled={isLoading}
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
        {isLoading ? (
          <AnimatePresence mode="popLayout">
            <motion.p
              className="text-sm font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={loadingStatus ?? "Загрузка..."}
            >
              {loadingStatus ?? "Загрузка..."}
            </motion.p>
          </AnimatePresence>
        ) : (
          <p className="text-sm font-semibold">
            Перетяните картинку сюда или нажмите чтобы выбрать
          </p>
        )}

        {!isLoading && (
          <p className="text-xs opacity-60">Максимальный размер: {maxMB}МБ</p>
        )}
      </div>
    </button>
  );
}
