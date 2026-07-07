import z from "zod";

export type GoogleBooksVolumesResponse = {
  kind: "books#volumes";
  items?: GoogleBooksVolume[];
  totalItems: number;
};

export type GoogleBooksVolume = {
  kind: "books#volume";
  id: string;
  etag: string;
  selfLink: string;

  volumeInfo?: {
    title?: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;

    industryIdentifiers?: {
      type?: string;
      identifier?: string;
    }[];

    pageCount?: number;

    dimensions?: {
      height?: string;
      width?: string;
      thickness?: string;
    };

    printType?: string;
    mainCategory?: string;
    categories?: string[];

    averageRating?: number;
    ratingsCount?: number;

    contentVersion?: string;

    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };

    language?: string;
    previewLink?: string;
    infoLink?: string;
    canonicalVolumeLink?: string;
  };

  userInfo?: {
    review?: unknown; // TODO: type mylibrary.reviews resource if you use OAuth
    readingPosition?: unknown; // TODO: type mylibrary.readingpositions resource
    isPurchased?: boolean;
    isPreordered?: boolean;
    updated?: string; // datetime
  };

  saleInfo?: {
    country?: string;
    saleability?: string;
    onSaleDate?: string; // datetime
    isEbook?: boolean;

    listPrice?: {
      amount?: number;
      currencyCode?: string;
    };

    retailPrice?: {
      amount?: number;
      currencyCode?: string;
    };

    buyLink?: string;
  };

  accessInfo?: {
    country?: string;
    viewability?: string;
    embeddable?: boolean;
    publicDomain?: boolean;
    textToSpeechPermission?: string;

    epub?: {
      isAvailable?: boolean;
      downloadLink?: string;
      acsTokenLink?: string;
    };

    pdf?: {
      isAvailable?: boolean;
      downloadLink?: string;
      acsTokenLink?: string;
    };

    webReaderLink?: string;
    accessViewStatus?: string;

    downloadAccess?: {
      kind?: "books#downloadAccessRestriction";
      volumeId?: string;
      restricted?: boolean;
      deviceAllowed?: boolean;
      justAcquired?: boolean;
      maxDownloadDevices?: number;
      downloadsAcquired?: number;
      nonce?: string;
      source?: string;
      reasonCode?: string;
      message?: string;
      signature?: string;
    };
  };

  searchInfo?: {
    textSnippet?: string;
  };
};

const RETRYABLE_GOOGLE_BOOKS_STATUSES = new Set([408, 429, 500, 502, 503, 504]);
const GOOGLE_BOOKS_RETRY_DELAYS_MS = [300, 900];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchGoogleBooksWithRetry(
  url: string,
  attempt = 0,
): Promise<Response> {
  const response = await fetch(url);

  if (
    response.ok ||
    !RETRYABLE_GOOGLE_BOOKS_STATUSES.has(response.status) ||
    attempt >= GOOGLE_BOOKS_RETRY_DELAYS_MS.length
  ) {
    return response;
  }

  await sleep(GOOGLE_BOOKS_RETRY_DELAYS_MS[attempt]);
  return fetchGoogleBooksWithRetry(url, attempt + 1);
}

const filterObjectSchema = z.object({
  intitle: z.string().optional().describe("Поиск по названию"),
  inauthor: z.string().optional().describe("Поиск по автору"),
  inpublisher: z.string().optional().describe("Поиск по издательству"),
  subject: z.string().optional().describe("Поиск по категориям"),
  isbn: z.string().optional().describe("Поиск по ISBN"),
  lccn: z.string().optional().describe("Поиск по LCCN"),
  oclc: z.string().optional().describe("Поиск по OCLC"),
});

export const filterSchema = filterObjectSchema.refine(
  (filter) => Object.values(filter).some((value) => value?.trim()),
  "Укажите хотя бы один фильтр поиска",
);

function buildQueryFromFilter(filter: z.infer<typeof filterSchema>): string {
  const { intitle, inauthor, inpublisher, subject, isbn, lccn, oclc } = filter;
  const parts: string[] = [];

  if (intitle) parts.push(`intitle:${intitle}`);
  if (inauthor) parts.push(`inauthor:${inauthor}`);
  if (inpublisher) parts.push(`inpublisher:${inpublisher}`);
  if (subject) parts.push(`subject:${subject}`);
  if (isbn) parts.push(`isbn:${isbn}`);
  if (lccn) parts.push(`lccn:${lccn}`);
  if (oclc) parts.push(`oclc:${oclc}`);

  return parts.join(" ");
}

export async function searchBooks(
  filter: string | z.infer<typeof filterSchema>,
) {
  const params = new URLSearchParams({
    q: typeof filter === "string" ? filter : buildQueryFromFilter(filter),
    maxResults: "10",
  });

  if (process.env.BOOKS_API_KEY) {
    params.set("key", process.env.BOOKS_API_KEY);
  }

  const url = `https://www.googleapis.com/books/v1/volumes?${params}`;
  const response = await fetchGoogleBooksWithRetry(url);

  if (!response.ok) {
    throw new Error(`Google Books request failed: ${response.status}`);
  }

  return (await response.json()) as GoogleBooksVolumesResponse;
}
