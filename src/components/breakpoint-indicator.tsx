"use client";

export function BreakpointIndicator() {
  return (
    <div className="fixed top-5 right-5 bg-zinc-100/50 dark:bg-zinc-900/50 border backdrop-blur-lg text-sm font-mono px-2 rounded-xl">
      <div className="sm:block md:hidden">sm</div>
      <div className="md:block lg:hidden">md</div>
      <div className="lg:block xl:hidden">lg</div>
      <div className="xl:block">xl</div>
    </div>
  );
}
