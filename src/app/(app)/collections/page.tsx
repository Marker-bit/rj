import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { CreateCollection } from "./create-collection";
import { CollectionView } from "./collection";

export default async function Page() {
  const { user } = await validateRequest();
  const collections = await db.collection.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      books: true,
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <CreateCollection />
      {collections.map((collection) => (
        <CollectionView key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
