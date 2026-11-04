"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export type FirstStep = {
  id: string;
  text: string;
  completed: boolean;
  skippable?: boolean;
};

function StepIcon({
  index,
  completed,
}: {
  index: number;
  completed: boolean;
}) {
  return (
    <div
      className={cn(
        "flex size-8 min-w-8 min-h-8 max-w-8 max-h-8 items-center justify-center rounded-full",
        completed
          ? "bg-primary text-white dark:text-black"
          : "bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-700",
      )}
    >
      {completed ? <Check className="size-4" /> : index}
    </div>
  );
}

export function FirstStepsCard({ steps }: { steps: FirstStep[] }) {
  const [skippedCover, setSkippedCover] = useState(false);

  useEffect(() => {
    setSkippedCover(localStorage.getItem("skipCoverStep") === "true");
  }, []);

  const visibleSteps = steps.filter(
    (step) => !(step.id === "cover" && skippedCover),
  );

  if (visibleSteps.every((step) => step.completed)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Первые шаги</CardTitle>
        <CardDescription>
          Чтобы вы лучше освоились в Читательском дневнике
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {visibleSteps.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-2">
              <StepIcon index={idx + 1} completed={step.completed} />
              <span className="flex-1">{step.text}</span>
              {step.skippable && !step.completed && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted-foreground"
                  aria-label="Пропустить добавление обложки"
                  onClick={() => {
                    localStorage.setItem("skipCoverStep", "true");
                    setSkippedCover(true);
                    toast.success("Шаг с обложкой пропущен");
                  }}
                >
                  Пропустить
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
