import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { Plus } from "lucide-react";
import { CreateCollection } from "./create-collection";

export default async function Page() {
  const { user } = await validateRequest();
  const collections = await db.collection.findMany({
    where: {
      userId: user?.id,
    },
  });

  return (
    <div className="flex flex-col">
      <CreateCollection />
      {collections.map((collection) => (
        <div
          key={collection.id}
          className="flex flex-col gap-3 border-b border-zinc-300 p-3 cursor-default"
        >
          {collection.name}
        </div>
      ))}
    </div>
  );
}
