"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { markAsRead } from "@/lib/actions/support";
import { CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ReadButton({
  answerId,
  read,
}: {
  answerId: string;
  read: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <Button
      variant="outline"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const res = await markAsRead(answerId);
        setLoading(false);
        if (res.error) {
          toast.error("Что-то пошло не так", {
            description: res.error,
          });
        } else {
          toast.success(res.message);
        }
        router.refresh();
      }}
      className="w-fit"
    >
      {loading ? (
        <Loader className="size-4" />
      ) : (
        <CheckCheck className="size-4" />
      )}
      {read ? "Отметить как непрочитанное" : "Отметить как прочитанное"}
    </Button>
  );
}
