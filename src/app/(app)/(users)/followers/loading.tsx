import { Loader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex">
      <div className="mx-auto mt-[40vh]">
        <Loader className="w-4 h-4" />
      </div>
    </div>
  );
}
