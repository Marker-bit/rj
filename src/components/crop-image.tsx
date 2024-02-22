"use client";

import React, { useState, useRef } from "react";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import { useDebounceCallback } from "usehooks-ts";

import "react-image-crop/dist/ReactCrop.css";
import Image from "next/image";
import { canvasPreview, useDebounceEffect } from "@/lib/utils";
import { DrawerDialog } from "@/app/Drawer";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function CropImage({
  open,
  setOpen,
  file,
  onSelect,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  file?: File;
  onSelect: (file: File) => void;
}) {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });
    const file = new File([blob], "avatar.png", {
      type: "image/png",
    });
    onSelect(file);
    setOpen(false);
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop]
  );

  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () =>
    setImgSrc(reader.result?.toString() || "")
  );
  reader.readAsDataURL(file);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {/* <div>
          <input type="file" accept="image/*" onChange={onSelectFile} />
        </div> */}
        {!!imgSrc && (
          <div data-vaul-no-drag>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop
            >
              <Image
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                width={500}
                height={500}
                className="rounded-xl"
              />
            </ReactCrop>
          </div>
        )}
        {!!completedCrop && (
          <>
            <div>
              <canvas ref={previewCanvasRef} className="hidden" />
            </div>
            <div>
              <Button onClick={onDownloadCropClick}>Сохранить</Button>
              <a
                href="#hidden"
                ref={hiddenAnchorRef}
                download
                style={{
                  position: "absolute",
                  top: "-200vh",
                  visibility: "hidden",
                }}
              >
                Hidden download
              </a>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
