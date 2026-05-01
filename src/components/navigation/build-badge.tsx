"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type BuildInfo = {
  label: string;
  url: string | null;
};

function BuildLabel({ build }: { build: BuildInfo }) {
  return (
    <>
      <span className="text-background/70">Версия</span>
      <span>{build.label}</span>
    </>
  );
}

export function LogoWithBuildTooltip({
  build,
  className,
}: {
  build: BuildInfo;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/home"
          className={cn("p-1 rounded-lg transition shrink-0", className)}
        >
          <Image
            src="/icon.png"
            alt="logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="px-2.5 py-2">
        {build.url ? (
          <a
            href={build.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-mono text-[11px] leading-none tracking-normal"
          >
            <BuildLabel build={build} />
          </a>
        ) : (
          <span className="flex items-center gap-2 font-mono text-[11px] leading-none tracking-normal">
            <BuildLabel build={build} />
          </span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

export function MobileBuildFooter({ build }: { build: BuildInfo }) {
  const className =
    "mt-1 flex items-center justify-between rounded-md border-t px-2 py-2 text-[11px] text-muted-foreground";

  if (!build.url) {
    return (
      <div className={className}>
        <span>Версия</span>
        <span className="font-mono tracking-normal">{build.label}</span>
      </div>
    );
  }

  return (
    <a
      href={build.url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        className,
        "transition-colors hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <span>Версия</span>
      <span className="font-mono tracking-normal">{build.label}</span>
    </a>
  );
}
