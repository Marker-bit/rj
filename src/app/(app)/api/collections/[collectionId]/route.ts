import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
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
