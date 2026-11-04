"use client";

import { BadgeCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setVerification } from "@/lib/actions/users";
import { revalidate } from "@/lib/actions/revalidate";

export default function BadgeCheckButton({
  userId,
  isVerified,
}: {
  userId: string;
  isVerified: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const changeVerification = async () => {
    toast.promise(
      async () => {
        setLoading(true);
        await setVerification(userId, !isVerified);
        setLoading(false);
        void revalidate("admin");
      },
      {
        loading: "Подождите...",
        success: "Подтверждение задано",
        error: "Не удалось задать подтверждение",
      },
    );
  };
  return isVerified ? (
    <Button disabled={loading} onClick={changeVerification}>
      <BadgeCheck />
      Снять подтверждение
    </Button>
  ) : (
    <Button disabled={loading} onClick={changeVerification}>
      <BadgeCheck />
      Подтвердить
    </Button>
  );
}
