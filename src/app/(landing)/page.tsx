import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/server-validate-request";
import Image from "next/image";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";

export default async function LandingPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { user } = await validateRequest();
  if (user && searchParams?.noRedirect !== "") return redirect("/home");

  return (
    <div className="flex items-center flex-col">
      <div className="h-screen p-2 w-full">
        <div
          className="p-2 rounded-xl border-zinc-100 w-full h-full flex flex-col gap-2 items-center justify-center"
          style={{
            background:
              "repeating-linear-gradient(to right, hsl(var(--border)), transparent 1px, transparent 10px), repeating-linear-gradient(to bottom, hsl(var(--border)), transparent 1px, transparent 10px)",
          }}
        >
          <div className="p-2 bg-gradient-to-b from-zinc-200 to-zinc-300 rounded-xl">
            <Image
              src="/favicon.png"
              width={100}
              height={100}
              alt="logo"
              className="size-14"
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
        </div>
      </div>
    </div>
  );
}
