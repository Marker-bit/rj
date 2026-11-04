import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { LoginButton } from "./login-button";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function LandingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { noRedirect } = use(searchParams);

  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center">
          <Image
            src="/icon.png"
            alt="Открытая книга с закладкой"
            width={512}
            height={512}
            className="mb-4 h-auto w-20 object-contain sm:w-24"
            priority
          />
          <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Читательский дневник
          </h1>
          <p className="mt-3 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
            Храните книги, отмечайте прогресс и возвращайтесь к истории своего
            чтения.
          </p>
          <div className="mt-5">
            <LoginButton noRedirect={noRedirect !== undefined} />
          </div>
        </div>
      </section>
      <footer className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 pb-6 text-sm text-muted-foreground">
        <span>Читательский дневник</span>
        <nav className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-foreground">
            Конфиденциальность
          </Link>
          <Link href="/terms-of-service" className="hover:text-foreground">
            Условия
          </Link>
        </nav>
      </footer>
    </main>
  );
}
