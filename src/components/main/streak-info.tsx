import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import StreakBlock from "./streak-block";

export async function StreakInfo() {
  const { user } = await validateRequest();
  if (!user) return null;

  const events = await db.readEvent.findMany({
    where: {
      book: {
        userId: user.id,
      },
    },
    include: {
      book: true,
    },
    orderBy: {
      readAt: "asc",
    },
  });

  const profile = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
  });

  return <StreakBlock events={events} user={user} />;

  // return (
  //   <div className="grid grid-cols-1 gap-2 md:grid-cols-2 w-full">
  //     {/* <StreakNotification events={events} user={user} />
  //     <StreakCounter events={events} user={user} /> */}
  //     <StreakBlock events={events} user={user} />

  //     {/* <Card>
  //       <CardHeader>
  //         <CardTitle>Ваш профиль</CardTitle>
  //         <CardDescription>Информация о вас в Читательском дневнике</CardDescription>
  //       </CardHeader>
  //       <CardContent>
  //       <Image
  //         src={profile.avatarUrl ? profile.avatarUrl : "/no-avatar.png"}
  //         alt="avatar"
  //         width={80}
  //         height={80}
  //         className="size-10 aspect-square rounded-full"
  //       />
  //       </CardContent>
  //     </Card>
  //     <div className="flex items-center gap-2 rounded-md border p-2">
  //       <Image
  //         src={profile.avatarUrl ? profile.avatarUrl : "/no-avatar.png"}
  //         alt="avatar"
  //         width={100}
  //         height={100}
  //         className="size-20 rounded-full"
  //       />
  //       <div className="flex flex-col">
  //         <div className="flex items-center gap-2 text-3xl font-semibold">
  //           {profile.firstName} {profile.lastName}
  //           {profile.verified && (
  //             <BadgeCheck className="size-6 text-yellow-500" />
  //           )}
  //         </div>
  //         <div className="text-sm text-muted-foreground/70">
  //           @{profile.username}
  //         </div>
  //       </div>
  //     </div> */}
  //   </div>
  // )
}
