import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  { params }: { params: { linkId: string } }
) {
  const { user } = await validateRequest()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { linkId } = params
  const link = await db.bookLink.findUniqueOrThrow({
    where: {
      id: linkId,
    },
    include: {
      book: true,
    },
  })

  const newBook = await db.book.create({
    data: {
      title: link.book.title,
      author: link.book.author,
      pages: link.book.pages,
      coverUrl: link.book.coverUrl,
      description: link.book.description,
      userId: user.id,
    },
  })

  return NextResponse.json({ bookId: newBook.id })
}
