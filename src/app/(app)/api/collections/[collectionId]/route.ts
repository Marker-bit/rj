import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ collectionId: string }> },
) {
  const { user } = await validateRequest();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const collection = await db.collection.findUnique({
    where: { id: (await props.params).collectionId, userId: user.id },
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
