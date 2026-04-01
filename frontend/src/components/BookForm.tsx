import React, { useState, useEffect } from 'react';
import type { Book } from '../types';

// Define the props this form accepts.
// It can accept an existing book (for editing) or nothing (for adding).
interface BookFormProps {
  initialData?: Book;
  onSubmit: (book: any) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ initialData, onSubmit, onCancel }) => {
  // 1. Single state object for the entire form!
  // If we passed in initialData (Edit mode), use it. Otherwise, use blank defaults (Add mode).
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    author: initialData?.author || '',
    publisher: initialData?.publisher || '',
    isbn: initialData?.isbn || '',
    classification: initialData?.classification || '',
    category: initialData?.category || '',
    pageCount: initialData?.pageCount || 0,
    price: initialData?.price || 0,
  });

  // 2. If the user clicks a different "Edit" button while the form is open, update the form data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // 3. Shared Handle Change function (The "Two-Way Binding" magic)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      // If the field is a number, parse it. Otherwise, keep it as a string.
      [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
    });
  };

  // 4. Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from refreshing!
    onSubmit(formData); // Pass the final object back up to the Admin page
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-dark text-white">
        <h4 className="mb-0">{initialData ? 'Edit Book' : 'Add New Book'}</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Title</label>
              <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Author</label>
              <input type="text" className="form-control" name="author" value={formData.author} onChange={handleChange} required />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Publisher</label>
              <input type="text" className="form-control" name="publisher" value={formData.publisher} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">ISBN</label>
              <input type="text" className="form-control" name="isbn" value={formData.isbn} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Category</label>
              <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} required />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-4">
              <label className="form-label fw-bold">Classification</label>
              <input type="text" className="form-control" name="classification" value={formData.classification} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Page Count</label>
              <input type="number" className="form-control" name="pageCount" value={formData.pageCount || ''} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Price ($)</label>
              <input type="number" step="0.01" className="form-control" name="price" value={formData.price || ''} onChange={handleChange} required />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              {initialData ? 'Update Book' : 'Add Book'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default BookForm;