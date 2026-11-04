"use client";

import { SparklesIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { setAI } from "@/lib/actions/users";
import { revalidate } from "@/lib/actions/revalidate";

export default function AIAllowButton({
  userId,
  aiEnabled,
}: {
  userId: string;
  aiEnabled: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const changeAI = async () => {
    toast.promise(
      async () => {
        setLoading(true);
        await setAI(userId, !aiEnabled);
        setLoading(false);
        void revalidate("admin");
      },
      {
        loading: "Подождите...",
        success: "Использование ИИ задано",
        error: "Не удалось задать использование ИИ",
      },
    );
  };

  return (
    <Button disabled={loading} onClick={changeAI}>
      {loading ? <Spinner /> : <SparklesIcon />}
      {aiEnabled ? "Выключить ИИ" : "Включить ИИ"}
    </Button>
  );
}
