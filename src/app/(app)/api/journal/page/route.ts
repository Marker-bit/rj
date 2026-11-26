import { type NextRequest, NextResponse } from "next/server";
import { getJournalPage, parseJournalPageParams } from "@/lib/journal-page";
import { validateRequest } from "@/lib/server-validate-request";

export async function GET(request: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const parsed = parseJournalPageParams(request.nextUrl.searchParams);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid journal page parameters" },
      { status: 400 },
    );
  }

  return NextResponse.json(await getJournalPage(user.id, parsed.data));
}
