import { Badge, IconBadge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import { CalendarIcon, CheckIcon, XIcon } from "lucide-react";
import AddRecommendation, { EditRecommendationButton } from "./add-recommendation";
import GenerateRecommendation from "./generate-recommendation";

export default async function Page() {
  const recommendations = await db.recommendation.findMany({
    where: {
      endsOn: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col items-start gap-2 p-4">
      <h1 className="text-3xl font-bold">Рекомендации</h1>
      <div className="flex gap-2">
        <AddRecommendation />
        <GenerateRecommendation />
      </div>
      <div className="flex flex-col gap-2">
        {recommendations.map((r) => (
          <div key={r.id} className="flex flex-col items-start gap-2 border p-4 rounded-xl">
            <div className="text-2xl font-bold -mb-2">{r.slogan}</div>
            <div className="text-sm">
              {r.title} - {r.author}
            </div>
            <div className="line-clamp-3 text-sm text-muted-foreground">
              {r.bookInfo}
            </div>
            <div className="flex gap-2">
              {r.published ? (
                <Badge variant="outline" className="gap-1">
                  <CheckIcon
                    className="text-emerald-500"
                    size={12}
                    aria-hidden="true"
                  />
                  Опубликована
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1">
                  <XIcon
                    className="text-red-500"
                    size={12}
                    aria-hidden="true"
                  />
                  Не опубликована
                </Badge>
              )}
              <IconBadge
                icon={CalendarIcon}
                variant={
                  isWithinInterval(new Date(), {
                    start: startOfDay(r.startsOn),
                    end: endOfDay(r.endsOn),
                  })
                    ? "default"
                    : "outline"
                }
              >
                {r.startsOn.toLocaleDateString()} -{" "}
                {r.endsOn.toLocaleDateString()}
              </IconBadge>
            </div>
            <EditRecommendationButton recommendation={r} />
          </div>
        ))}
      </div>
    </div>
  );
}
