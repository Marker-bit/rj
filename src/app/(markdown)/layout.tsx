import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pt-8 pb-16 sm:pt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Читательский дневник
        </Link>

        <article
          className="mt-6 text-[0.9375rem] leading-7 text-foreground/90
            [&>*:first-child]:mt-0
            [&_h1]:mt-2 [&_h1]:text-3xl [&_h1]:leading-tight [&_h1]:font-semibold [&_h1]:tracking-[-0.035em] [&_h1]:text-foreground sm:[&_h1]:text-4xl
            [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:leading-snug [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-foreground
            [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground
            [&_p]:mt-3 [&_p]:leading-7
            [&_strong]:font-semibold [&_strong]:text-foreground
            [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:break-words
            [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5
            [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5
            [&_li]:pl-1 [&_li]:leading-7 [&_li]:marker:text-muted-foreground
            [&_li>p]:mt-0
            [&_hr]:my-8 [&_hr]:border-border
            [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground
            [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em]
            [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
            [&_th]:border-b [&_th]:px-2 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold
            [&_td]:border-b [&_td]:px-2 [&_td]:py-2"
        >
          {children}
        </article>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground">
          <span>Читательский дневник</span>
          <nav className="flex flex-wrap gap-4">
            <Link href="/terms-of-service" className="hover:text-foreground">
              Пользовательское соглашение
            </Link>
            <Link href="/privacy-policy" className="hover:text-foreground">
              Политика конфиденциальности
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
