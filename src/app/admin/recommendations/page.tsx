import { Badge, IconBadge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { dateToString, declOfNum } from "@/lib/utils";
import { TZDate } from "@date-fns/tz";
import {
  differenceInDays,
  endOfDay,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { BookIcon, CalendarIcon, CheckIcon, XIcon } from "lucide-react";
import AddRecommendation, {
  CopyRecommendationButton,
  DeleteRecommendationButton,
  DuplicateRecommendationButton,
  EditRecommendationButton,
  PasteRecommendation,
} from "./add-recommendation";
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
    include: {
      _count: {
        select: {
          createdBooks: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col items-start gap-2 p-4">
      <h1 className="text-3xl font-bold">Рекомендации</h1>
      <div className="flex gap-2 flex-wrap">
        <AddRecommendation />
        <GenerateRecommendation />
        <PasteRecommendation />
      </div>
      <div className="flex flex-col gap-2 w-full max-w-full">
        {recommendations.map((r) => (
          <div
            key={r.id}
            className="flex flex-col items-start gap-2 border p-4 rounded-xl"
          >
            <div className="text-2xl font-bold -mb-2 wrap-anywhere">
              {r.slogan}
            </div>
            <div className="text-sm wrap-anywhere">
              {r.title} - {r.author}
            </div>
            <div className="line-clamp-3 text-sm text-muted-foreground wrap-anywhere">
              {r.bookInfo}
            </div>
            <div className="flex gap-2 flex-wrap">
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
                {dateToString(new TZDate(r.startsOn, "Europe/Moscow"))} -{" "}
                {dateToString(new TZDate(r.endsOn, "Europe/Moscow"))} (
                {differenceInDays(r.endsOn, r.startsOn) + 1} дн.)
              </IconBadge>
              <IconBadge icon={BookIcon} variant="outline">
                {r._count.createdBooks}{" "}
                {declOfNum(r._count.createdBooks, ["книга", "книги", "книг"])}
              </IconBadge>
            </div>
            <div className="flex gap-2 flex-wrap">
              <EditRecommendationButton recommendation={r} />
              <DeleteRecommendationButton recommendationId={r.id} />
              <DuplicateRecommendationButton recommendationId={r.id} />
              <CopyRecommendationButton recommendation={r} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
