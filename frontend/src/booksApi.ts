import type { Book } from './types';

// Centralized base URL. We will change this to your Azure URL in Step 10!
const API_URL = 'https://goates-books-api-ebhygeevfyeteshf.westus2-01.azurewebsites.net/api/books';

// Define the exact shape of our paginated GET response
export interface FetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}

// GET: Fetch all books (with filtering and pagination)
export const fetchBooks = async (
  pageNum: number,
  pageSize: number,
  sortByTitle: boolean,
  selectedCategories: string[]
): Promise<FetchBooksResponse> => {
  const categoryParams = selectedCategories
    .map((cat) => `category=${encodeURIComponent(cat)}`)
    .join('&');

  const url = `${API_URL}?pageNum=${pageNum}&pageSize=${pageSize}&sortByTitle=${sortByTitle}${
    categoryParams ? `&${categoryParams}` : ''
  }`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch books');
  return await response.json();
};

// POST: Add a new book
export const addBook = async (newBook: Omit<Book, 'bookId'>): Promise<Book> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBook),
  });
  if (!response.ok) throw new Error('Failed to add book');
  return await response.json();
};

// PUT: Update an existing book
export const updateBook = async (bookId: number, updatedBook: Book): Promise<Book> => {
  const response = await fetch(`${API_URL}/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBook),
  });
  if (!response.ok) throw new Error('Failed to update book');
  return await response.json();
};

// DELETE: Remove a book
export const deleteBook = async (bookId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${bookId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete book');
};