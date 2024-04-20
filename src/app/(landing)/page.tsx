import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/server-validate-request";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LandingPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { user } = await validateRequest();
  if (user && searchParams?.noRedirect !== "") return redirect("/home");

  return (
    <div className="flex items-center flex-col">
      <div
        className="h-screen p-2 w-full overflow-hidden"
        style={{
          background:
            "repeating-linear-gradient(to right, hsl(var(--border)), transparent 1px, transparent 10px), repeating-linear-gradient(to bottom, hsl(var(--border)), transparent 1px, transparent 10px)",
        }}
      >
        <div
          className="p-2 rounded-xl border-zinc-100 w-full h-full flex flex-col gap-2 items-center justify-center overflow-hidden"
          style={{
            backgroundImage: [
              "radial-gradient(ellipse at top, transparent 60%, hsl(var(--primary) / 0.2))",
              "linear-gradient(to bottom, transparent 30%, hsl(var(--primary) / 0.2))",
              "linear-gradient(to bottom, hsl(var(--background)) 40%, transparent)",
              "repeating-linear-gradient(45deg, transparent,transparent 60px, hsl(var(--primary)) 61px, transparent 62px)",
            ].join(", "),
          }}
        >
          <div className="p-2 bg-gradient-to-b from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 rounded-xl">
            <Image
              src="/favicon.png"
              width={100}
              height={100}
              alt="logo"
              className="size-14"
              loading="eager"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-center">
            Читательский дневник
          </h1>
          <p className="text-xl text-center">
            Читайте, пишите и делитесь своими любимыми книгами
          </p>
          {user ? (
            <Link href="/home">
              <Button>Открыть</Button>
            </Link>
          ) : (
            <Link href="/auth">
              <Button>Начать</Button>
            </Link>
          )}
          <div
            className="mb-[-150px] mt-16 size-[300px] rounded-full bg-background md:mb-[-250px] md:size-[500px]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 0%, transparent 40%, hsl(var(--primary)))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
