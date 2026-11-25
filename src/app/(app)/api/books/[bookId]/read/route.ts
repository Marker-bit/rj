import { endOfDay, subDays } from "date-fns";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { recordReadingProgress } from "@/lib/book-progress-write";
import { submittedPageNumber } from "@/lib/validation/schemas";
import { validateRequest } from "@/lib/server-validate-request";
export async function POST(
  req: NextRequest,
  props: { params: Promise<{ bookId: string }> },
) {
  const params = await props.params;
  const bookId = params.bookId;
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse("Not Authorized", {
      status: 401,
    });
  }
  const parsed = z
    .object({
      pages: submittedPageNumber,
      readAt: z
        .union([z.string(), z.number()])
        .pipe(z.coerce.date())
        .optional(),
    })
    .safeParse(await req.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error }, { status: 400 });
  }

  const result = await recordReadingProgress({
    bookId,
    userId: user.id,
    pagesRead: parsed.data.pages,
    readAt: parsed.data.readAt
      ? parsed.data.readAt
      : endOfDay(subDays(new Date(), 1)),
  });
  if (result.kind === "not-found") {
    return new NextResponse("Not Found", { status: 404 });
  }
  if (result.kind === "out-of-range") {
    return NextResponse.json(
      { error: "Page exceeds book page count" },
      { status: 400 },
    );
  }
  return NextResponse.json(result.event, { status: 201 });
}
