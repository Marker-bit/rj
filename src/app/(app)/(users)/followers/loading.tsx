import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex">
      <div className="mx-auto mt-[40vh]">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    </div>
  );
}
