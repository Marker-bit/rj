import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { validateRequest } from "@/lib/server-validate-request";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  bookCover: f({ image: { maxFileSize: "8MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { user } = await validateRequest();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
  avatar: f({ image: { maxFileSize: "8MB" } })
    // .middleware(async ({ req }) => {
    //   const { user } = await validateRequest();

    //   if (!user) throw new UploadThingError("Unauthorized");

    //   return { userId: user.id };
    // })
    .onUploadComplete(async ({ metadata, file }) => {
      // console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});
