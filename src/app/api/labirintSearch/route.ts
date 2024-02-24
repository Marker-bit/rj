import * as cheerio from "cheerio";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) return new NextResponse(null);
  const query = encodeURI(q);
  const resp = await fetch(`https://www.labirint.ru/search/${query}/`);
  const html = await resp.text();
  const $ = cheerio.load(html);
  const res = $(".product-card")
    .toArray()
    .map(function (el) {
      const title = $(el).find(".product-card__name").text().trim();
      const imageUrl = $(el)
        .find(".product-card__img .book-img-cover")
        .attr("data-src");
      const authors = $(el).find(".product-card__author").text().trim();
      return {
        title,
        imageUrl:
          imageUrl === "https://img.labirint.ru/design/emptycover-big.svg"
            ? null
            : imageUrl,
        authors,
      };
    });
  return NextResponse.json(res);
}
