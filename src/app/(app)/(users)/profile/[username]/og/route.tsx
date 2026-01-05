import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ username: string }> },
) {
  const params = await props.params;
  const { username } = params;

  const user = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return new Response(null, { status: 404 });
  }

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        fontSize: 60,
        color: "black",
        background: "#f6f6f6",
        width: "100%",
        height: "100%",
        paddingTop: 50,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ opacity: 0.5, fontSize: 40, marginBottom: 20 }}>
        Читательский дневник
      </div>
      {/** biome-ignore lint/performance/noImgElement: this is an OG */}
      <img
        alt="Avatar"
        width="256"
        height="256"
        src={user.avatarUrl}
        style={{
          borderRadius: 128,
        }}
      />
      <span>@{user.username}</span>
      <span style={{ opacity: 0.5, fontSize: 40 }}>
        {user.firstName} {user.lastName}
      </span>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
