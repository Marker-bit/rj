"use client"

import React, { useRef, useState } from "react"

import { Area, getCroppedImg } from "@/lib/crop/utils"
import "react-image-crop/dist/ReactCrop.css"
import { Button } from "./ui/button"
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from "./ui/cropper"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

export function CropImage({
  open,
  setOpen,
  file,
  onSelect
}: {
  open: boolean
  setOpen: (v: boolean) => void
  file: File;
  onSelect: (file: File) => void
}) {
  const [imgSrc, setImgSrc] = useState("")
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const [cropData, setCropData] = React.useState<Area | null>(null)

  const reader = new FileReader()
  reader.addEventListener("load", () =>
    setImgSrc(reader.result?.toString() || "")
  )
  reader.readAsDataURL(file)

  const handleCrop = async () => {
    if (!cropData) {
      console.error("No crop area selected.")
      return
    }

    try {
      const croppedBlob = await getCroppedImg(
        imgSrc,
        cropData
      )
      if (!croppedBlob) {
        throw new Error("Failed to generate cropped image blob.")
      }

      onSelect(new File([croppedBlob], "avatar.png", { type: "image/png" }))
      setOpen(false)
    } catch (error) {
      console.error("Error during cropping:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Выберите часть аватара
          </DialogTitle>
        </DialogHeader>
        {/* <div>
          <input type="file" accept="image/*" onChange={onSelectFile} />
        </div> */}
        {!!imgSrc && (
          <div data-vaul-no-drag>
            <Cropper
              className="h-80"
              image={imgSrc}
              maxZoom={10}
              onCropChange={setCropData}
            >
              <CropperDescription />
              <CropperImage />
              <CropperCropArea className="rounded-full" />
            </Cropper>
          </div>
        )}
        <Button onClick={handleCrop}>Сохранить</Button>
        {/* {!!completedCrop && (
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
        )} */}
      </DialogContent>
    </Dialog>
  )
}
