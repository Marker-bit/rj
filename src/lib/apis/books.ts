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

export async function searchBooks(searchQuery: string) {
  const params = new URLSearchParams({
    q: searchQuery,
    maxResults: "10",
  });

  if (process.env.BOOKS_API_KEY) {
    params.set("key", process.env.BOOKS_API_KEY);
  }

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?${params}`,
  );

  if (!response.ok) {
    throw new Error(`Google Books request failed: ${response.status}`);
  }

  return (await response.json()) as GoogleBooksVolumesResponse;
}
