import type { ToolId, ToolView } from "@/lib/ai/tools/types";
import { createBookToolView } from "@/lib/ai/tools/views/create-book";
import { createCollectionToolView } from "@/lib/ai/tools/views/create-collection";
import { deleteBookToolView } from "@/lib/ai/tools/views/delete-book";
import { deleteCollectionToolView } from "@/lib/ai/tools/views/delete-collection";
import { getAllBooksToolView } from "@/lib/ai/tools/views/get-all-books";
import { getAllCollectionsToolView } from "@/lib/ai/tools/views/get-all-collections";
import { addBookEventToolView } from "./views/add-book-event";
import { getBookByIdToolView } from "./views/get-book-by-id";
import { undoBookEventToolView } from "./views/undo-book-event";
import { editBookToolView } from "./views/edit-book";
import { searchGoogleBooksToolView } from "./views/search-google-books";

export const toolViews: Record<ToolId, ToolView> = {
  getAllBooks: getAllBooksToolView,
  getBookById: getBookByIdToolView,
  createBook: createBookToolView,
  editBook: editBookToolView,
  deleteBook: deleteBookToolView,
  createCollection: createCollectionToolView,
  deleteCollection: deleteCollectionToolView,
  getAllCollections: getAllCollectionsToolView,
  addBookEvent: addBookEventToolView,
  undoBookEvent: undoBookEventToolView,
  searchGoogleBooks: searchGoogleBooksToolView,
};
