import { db } from "@/lib/db";
import { declOfNum } from "@/lib/utils";
import UserPagination from "./pagination";
import UserTable from "./table";

export default async function Page(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  let page = searchParams?.page ? parseInt(searchParams.page as string) : 1;
  const pageSize = 20;
  if (page < 1) {
    page = 1;
  }
  const fullCount = await db.user.count();
  const totalPages = Math.ceil(fullCount / pageSize);
  if (page > totalPages) {
    page = totalPages;
  }
  const users = await db.user.findMany({
    include: {
      books: true,
    },
    orderBy: {
      registeredAt: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Пользователей</h1>
        <p className="text-muted-foreground">
          {fullCount}{" "}
          {declOfNum(fullCount, [
            "пользователь",
            "пользователя",
            "пользователей",
          ])}
        </p>
      </div>
      <UserTable users={users} />
      <UserPagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
