"use client"

export function BreakpointIndicator() {
  return (
    <div className="fixed right-5 top-5 rounded-xl border bg-zinc-100/50 px-2 font-mono text-sm backdrop-blur-lg dark:bg-zinc-900/50">
      <div className="sm:block md:hidden">sm</div>
      <div className="md:block lg:hidden">md</div>
      <div className="lg:block xl:hidden">lg</div>
      <div className="xl:block">xl</div>
    </div>
  )
}
