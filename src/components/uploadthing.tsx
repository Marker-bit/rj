import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react"

import type { OurFileRouter } from "@/app/(app)/(api)/api/uploadthing/core"

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>()

export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()
