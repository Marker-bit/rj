import type { GroupBookSuggestion } from "@/generated/prisma/client";
import { GroupMemberRole } from "@/generated/prisma/enums";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { revalidate } from "@/lib/actions/revalidate";

export function Suggestion({
  suggestion,
  role,
}: {
  suggestion: GroupBookSuggestion;
  role: GroupMemberRole;
}) {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/groups/${suggestion.groupId}/suggestion/${suggestion.id}`,
        { method: "POST" },
      );
      if (!response.ok) throw new Error("Suggestion acceptance failed");
      const result = z
        .object({ message: z.string().min(1) })
        .parse(await response.json());
      toast.success(result.message);
      void revalidate("groups");
    } catch {
      toast.error(
        "Не удалось добавить предложенную книгу. Попробуйте ещё раз.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex gap-2">
      {suggestion.coverUrl && (
        <Image
          src={suggestion.coverUrl}
          alt="book cover"
          width={48}
          height={48}
          className="size-12 rounded-md"
        />
      )}
      <div className="flex flex-col">
        <div className="text-lg font-bold">{suggestion.title}</div>
        <div className="text-sm text-muted-foreground">{suggestion.author}</div>
        <div className="text-sm text-muted-foreground">
          {suggestion.description}
        </div>
      </div>
      {role !== GroupMemberRole.MEMBER && (
        <Button
          aria-label={`Добавить предложенную книгу «${suggestion.title}»`}
          disabled={loading}
          variant="ghost"
          className="ml-auto"
          size="icon"
          onClick={onClick}
        >
          {loading ? (
            <Loader className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
        </Button>
      )}
    </div>
  );
}
