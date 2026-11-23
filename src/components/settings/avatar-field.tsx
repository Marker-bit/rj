"use client";

import { useDropzone } from "@uploadthing/react";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { CropImage } from "@/components/crop-image";
import { Loader } from "@/components/ui/loader";
import { useUploadThing } from "@/components/uploadthing";
import { cn } from "@/lib/utils";

export function AvatarField({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
  const [cropOpen, setCropOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 1) {
      setFiles(acceptedFiles);
      setCropOpen(true);
    } else {
      toast.error("Принимается только 1 файл!");
    }
  }, []);

  const { startUpload, routeConfig } = useUploadThing("avatar", {
    onClientUploadComplete: (res) => {
      onChange(res[0].ufsUrl);
      setUploadProgress(null);
    },
    onUploadError: () => {
      toast.error("Произошла ошибка при загрузке файла");
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div
          className="relative flex size-fit cursor-pointer"
          {...getRootProps()}
        >
          <Image
            src={value}
            className="size-20 rounded-full"
            width={80}
            height={80}
            alt="avatar"
          />
          <input disabled={uploadProgress !== null} {...getInputProps()} />
          <div
            className={cn(
              "absolute top-0 left-0 pointer-events-none w-full h-full bg-black/80 flex flex-col items-center justify-center opacity-0 text-white transition-opacity",
              uploadProgress !== null && "opacity-100",
            )}
          >
            <Loader className="size-4" />
            {uploadProgress !== null && <div>{uploadProgress}%</div>}
          </div>
        </div>
      ) : (
        <div
          className="flex size-20 cursor-pointer items-center justify-center rounded-full border"
          {...getRootProps()}
        >
          <Plus className="size-4 text-zinc-500" />
          <input disabled={uploadProgress !== null} {...getInputProps()} />
        </div>
      )}
      {files.length > 0 && (
        <CropImage
          open={cropOpen}
          setOpen={setCropOpen}
          file={files[0]}
          onSelect={(file) => {
            startUpload([file]);
          }}
        />
      )}
    </div>
  );
}
