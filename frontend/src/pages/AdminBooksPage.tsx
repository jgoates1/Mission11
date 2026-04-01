import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBooks, addBook, updateBook, deleteBook } from '../booksApi'; // ADDED: addBook import
import type { Book } from '../types';
import BookForm from '../components/BookForm'; // ADDED: BookForm import

function AdminBooksPage() {
  const navigate = useNavigate();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NEW STATE: Toggle the Add Form visibility
  const [showAddForm, setShowAddForm] = useState(false);

  const [editingBook, setEditingBook] = useState<Book | null>(null); // check for updates and track the book

  const [pageNum, setPageNum] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [pageSize, setPageSize] = useState(10); // <-- CHANGED THIS TO STATE!

  // REFACTORED: Moved loadBooks outside useEffect so we can call it after adding a book!
  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await fetchBooks(pageNum, pageSize, false, []);
      setBooks(data.books);
      setTotalBooks(data.totalNumBooks); // <-- ADD THIS LINE
    } catch (err: any) {
      setError(err.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [pageNum, pageSize]); // <-- ADD pageNum TO THIS ARRAY

  // Handle form submission for a new book
  const handleAddSubmit = async (newBookData: Omit<Book, 'bookId'>) => {
    try {
      await addBook(newBookData); // 1. Send POST request to backend
      setShowAddForm(false);      // 2. Hide the form
      loadBooks();                // 3. Refresh the table data!
    } catch (err: any) {
      alert(err.message || 'Failed to add book');
    }
  };

  // Handle form submission for editing a book
  const handleEditSubmit = async (updatedBookData: Book) => {
    try {
      if (editingBook) {
        // We pass the ID and the new data to the backend
        await updateBook(editingBook.bookId, updatedBookData); 
        setEditingBook(null); // Hide the form
        loadBooks();          // Refresh the table
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update book');
    }
  };

  //Handle deleting a book
  const handleDelete = async (bookId: number) => {
    // Standard browser confirmation dialog
    if (window.confirm("Are you sure you want to delete this book? This cannot be undone.")) {
      try {
        await deleteBook(bookId); // 1. Send DELETE request to backend
        loadBooks();              // 2. Refresh the table data!
      } catch (err: any) {
        alert(err.message || 'Failed to delete book');
      }
    }
  };

  const totalPages = Math.ceil(totalBooks / pageSize);

  return (
    <div className="container-fluid mt-4 px-4">
      <header className="mb-4 border-bottom pb-3 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="text-dark">Admin Dashboard</h1>
          <p className="text-muted mb-0">Manage bookstore inventory</p>
        </div>
        {/* ADDED me-5 pe-5 to push the buttons away from the floating cart */}
        <div className="w-100 d-flex justify-content-center">
          <div>
            <button 
              className="btn btn-primary me-2" 
              onClick={() => {
                setShowAddForm(true);
                setEditingBook(null);
              }}
            >
              Add a Book
            </button>

            <button 
              className="btn btn-outline-secondary" 
              onClick={() => navigate('/')}
            >
              Back to Store
            </button>
          </div>
        </div>
      </header>

      {/* Conditionally render the BookForm if showAddForm is true */}
      {showAddForm && (
        <BookForm 
          onSubmit={handleAddSubmit} 
          onCancel={() => setShowAddForm(false)} 
        />
      )}

      {/* Edit Form Component */}
      {editingBook && (
        <BookForm 
          initialData={editingBook} 
          onSubmit={handleEditSubmit} 
          onCancel={() => setEditingBook(null)} 
        />
      )}

      {loading && <div className="alert alert-info">Loading inventory...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Conditionally render the table ONLY if NEITHER form is showing */}
      
      {!loading && !error && !showAddForm && !editingBook && ( // <-- !editingBook HERE
        <> 
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.bookId}>
                <td>{b.bookId}</td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.category}</td>
                <td>${b.price.toFixed(2)}</td>
                <td>
                  {/* Pass the full book object into state when clicked */}
                  <button 
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => setEditingBook(b)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(b.bookId)} // this line calls the delete function
                  >
                    Delete
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
            <label className="me-2 text-dark fw-bold">Results per page:</label>
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
              <option value={50}>50</option> {/* Added a 50 option for admins! */}
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
        </>
      )}
    </div>
  );
}

export default AdminBooksPage;