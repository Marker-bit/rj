import { Loader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex items-center">
      <div className="absolute top-1/2 -translate-y-1/2">
        <Loader className="w-4 h-4" />
      </div>
    </div>
  );
}
