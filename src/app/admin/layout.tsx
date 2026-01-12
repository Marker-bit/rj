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

  const auth = validateRequest().then(async ({ user }) => {
    if (!user) {
      return { user: null, unread: null };
    }
    const unread = await db.supportAnswer.count({
      where: {
        read: {
          none: {
            userId: user?.id,
          },
        },
        question: {
          fromUserId: user?.id,
        },
      },
    });
    return { user, unread };
  });

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminNavBar auth={auth} />
      {children}
    </div>
  );
}
