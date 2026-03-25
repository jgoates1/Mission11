import { useEffect, useState } from 'react';
import type { Book } from '../types';
import { useCart } from '../CartContext'; // ADDED IMPORT

// Define the props we are receiving from App.tsx
interface BookListProps {
    selectedCategories: string[];
}

function BookList({ selectedCategories }: BookListProps) {
    const { addToCart } = useCart(); // grabs the function from context
    const [books, setBooks] = useState<Book[]>([]);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalNumBooks, setTotalNumBooks] = useState(0);
    const [sortByTitle, setSortByTitle] = useState(false);

    // Whenever the selected categories change, reset the page number to 1
    useEffect(() => {
        setPageNum(1);
    }, [selectedCategories]);

    // Fetch the books whenever pageNum, pageSize, sorting, or categories change
    useEffect(() => {
        const fetchBooks = async () => {
            // Format the array into query string pieces: "category=Biography&category=Classic"
            const categoryParams = selectedCategories
                .map(cat => `category=${encodeURIComponent(cat)}`)
                .join("&");

            // Build the final URL safely appending the category params if they exist
            const url = `http://localhost:4000/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortByTitle=${sortByTitle}${categoryParams ? `&${categoryParams}` : ""}`;

            const response = await fetch(url);
            const data = await response.json();
            
            setBooks(data.books);
            setTotalNumBooks(data.totalNumBooks);
        };

        fetchBooks();
    }, [pageNum, pageSize, sortByTitle, selectedCategories]); // Added selectedCategories here!

    const totalPages = Math.ceil(totalNumBooks / pageSize);

    return(
        <div className="container mt-4">
          <h2 className="mb-4 text-dark">Bookstore Catalog</h2>
          
          {/* A temporary indicator so we know our state is working */}
          <p className="text-muted">
            Showing page {pageNum} (Total Books: {totalNumBooks})
          </p>
  
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                {/* Make the Title header clickable to toggle sorting */}
                <th 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => {
                    setSortByTitle(!sortByTitle);
                    setPageNum(1); // Reset to page 1 when sorting changes
                  }}
                >
                  Title {sortByTitle ? '🔽' : '🔼'}
                </th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Classification</th>
                <th>Category</th>
                <th>Pages</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.bookId}>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.publisher}</td>
                  <td>{b.isbn}</td>
                  <td>{b.classification}</td>
                  <td>{b.category}</td>
                  <td>{b.pageCount}</td>
                  <td>${b.price.toFixed(2)}</td>
                  
                  <td>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        addToCart({
                          bookId: b.bookId,
                          title: b.title,
                          price: b.price,
                          quantity: 1
                        });
                      }}
                    >
                      Add to Cart
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
  
          {/* Pagination Controls Section */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            
            {/* Page Size Dropdown */}
            <div>
              <label className="me-2">Results per page:</label>
              <select
                className="form-select d-inline-block w-auto"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageNum(1); // Reset to page 1 so we don't land on an empty page
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
  
            {/* Previous, Numbered Links, and Next Buttons */}
            <div>
              <button
                className="btn btn-outline-primary me-2"
                disabled={pageNum === 1}
                onClick={() => setPageNum(pageNum - 1)}
              >
                Previous
              </button>
              
              {/* Dynamically generating the page number buttons */}
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  // If the current page matches this button, make it solid blue (btn-primary). Otherwise, outline.
                  className={`btn me-2 ${pageNum === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setPageNum(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                className="btn btn-outline-primary"
                disabled={pageNum === totalPages || totalPages === 0}
                onClick={() => setPageNum(pageNum + 1)}
              >
                Next
              </button>
            </div>
            
          </div>
        </div>
    );
}

export default BookList;