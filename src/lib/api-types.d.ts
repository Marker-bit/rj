type Book = {
  id: string;
  title: string;
  author: string;
  pages: number;
  userId: string;
  collections: any[];
  readEvents: {
    bookId: string;
    id: string;
    pagesRead: number;
    readAt: string;
  }[];
};
