import AdminNavBar from "@/components/navigation/admin-navbar";
import { getBuildInfo } from "@/lib/build-info";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { validateRequest } from "@/lib/server-validate-request";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  if (!user.admin) redirect("/home");

  const auth = validateRequest().then(async ({ user: authUser }) => {
    if (!authUser) {
      return { user: null, unread: null };
    }
    const unread = await db.supportAnswer.count({
      where: {
        read: {
          none: {
            userId: authUser.id,
          },
        },
        question: {
          fromUserId: authUser.id,
        },
      },
    });
    return { user: authUser, unread };
  });

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminNavBar auth={auth} build={getBuildInfo()} />
      {children}
    </div>
  );
}
