import { useEffect, useState } from 'react';
import type { Book } from './types';

function BookList() {
    const [books, setBooks] = useState <Book[]>([]);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(5); // we want 5 books per page
    const [totalNumBooks, setTotalNumBooks] = useState(0);
    // this one is for the sorting stuff
    const [sortByTitle, setSortByTitle] = useState(false);

    // useEffect runs when pageNum or pageSize changes
    useEffect(() => {
        const fetchBooks = async () => {
            // Using backticks (`) to inject our variables into the URL
            const response = await fetch(`http://localhost:4000/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortByTitle=${sortByTitle}`);
            const data = await response.json();
            
            // Notice how we access data.books and data.totalNumBooks now!
            setBooks(data.books);
            setTotalNumBooks(data.totalNumBooks);
        };

        fetchBooks();
    }, [pageNum, pageSize, sortByTitle]); // React will re-run the effect if these change

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