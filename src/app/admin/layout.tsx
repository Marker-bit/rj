import AdminNavBar from "@/components/navigation/admin-navbar";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) return null;
  if (!user.admin) return null;

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
      <AdminNavBar auth={auth} />
      {children}
    </div>
  );
}
