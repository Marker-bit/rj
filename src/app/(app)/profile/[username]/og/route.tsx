import { db } from "@/lib/db";
import { useParams } from "next/navigation";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const user = db.user.findUniqueOrThrow({
    where: {
      username: params.username,
    },
    include: {
      follower: true,
      following: true,
    },
  });
  // const fileNames: {
  //   font: string;
  //   name: string;
  //   weight: Weight;
  //   italic: boolean;
  // }[] = [
  //   { font: "Rubik", name: "Rubik-Light", weight: 300, italic: false },
  //   { font: "Rubik", name: "Rubik-Regular", weight: 400, italic: false },
  //   { font: "Rubik", name: "Rubik-Medium", weight: 500, italic: false },
  //   { font: "Rubik", name: "Rubik-Black", weight: 900, italic: false },
  // ];
  // const fontsPromises = fileNames.map(async (fileData) => {
  //   console.log(
  //     new URL(
  //       `../../../../../../public/fonts/${fileData.name}.ttf`,
  //       import.meta.url
  //     ).toString()
  //   );
  //   const fontResp = await fetch(
  //     new URL(
  //       `../../../../../../public/fonts/${fileData.name}.ttf`,
  //       import.meta.url
  //     )
  //   );
  //   // const fontData = await fontResp.arrayBuffer();
  //   // return {
  //   //   name: fileData.font,
  //   //   data: fontData,
  //   //   style: (fileData.italic ? "italic" : "normal") as "italic" | "normal",
  //   //   weight: fileData.weight,
  //   // };
  // });
  // const fonts = [await fontsPromises[0]];
  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-screen h-screen items-center justify-center"
        style={{
          fontFamily: "Inter",
          fontWeight: 900,
        }}
      >
        <div tw="absolute top-5 left-5 flex items-center">
          <div tw="bg-black w-10 h-10 mr-2" />
          Читательский дневник
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width="256"
          height="256"
          src={(await user).avatarUrl}
          style={{
            borderRadius: 10000000000000000,
          }}
          alt="avatar"
          tw="w-50 h-50 mb-2"
        />
        <div
          tw="text-6xl"
        >
          {(await user).firstName + " " + (await user).lastName}
        </div>
        <div tw="text-sm text-black/80">{"@" + (await user).username}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // fonts: [
      //   {
      //     name: "Inter",
      //     data: fontData,
      //     style: "normal",
      //     weight: 100,
      //   },
      //   {
      //     name: "Inter",
      //     data: fontData,
      //     style: "normal",
      //     weight: 900,
      //   },
      // ],
    }
  );
}
