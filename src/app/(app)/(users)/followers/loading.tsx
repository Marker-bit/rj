import { Loader } from "@/components/ui/loader"

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Loader className="w-4 h-4" />
    </div>
  )
}
