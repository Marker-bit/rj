import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { CollectionView } from "./collection";
import { CreateCollection } from "./create-collection";

export const dynamic = "force-dynamic";

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
    <div className="flex flex-col gap-2 max-sm:mb-[15vh]">
      <CreateCollection />
      {collections.length === 0 && (
        <p className="p-3 text-muted-foreground">
          У вас пока нет коллекций. Создайте коллекцию, чтобы объединить книги
          по теме, жанру или настроению.
        </p>
      )}
      {collections.map((collection) => (
        <CollectionView key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
