import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ collectionId: string }> },
) {
  const collection = await db.collection.findUnique({
    where: { id: (await props.params).collectionId },
  });

  if (!collection) {
    return new Response("Коллекция не найдена", { status: 404 });
  }

  return new Response(
    JSON.stringify({
      id: collection.id,
      name: collection.name,
    }),
    { status: 200 },
  );
}
