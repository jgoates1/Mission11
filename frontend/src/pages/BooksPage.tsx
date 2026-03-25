import { useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import BookList from '../components/BookList';

function BooksPage() {
  // LIFTED STATE: Moved here from App.tsx!
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <div className="container-fluid mt-4 px-4">
      
      <header className="mb-4 border-bottom pb-3">
        <h1 className="text-dark">Welcome to Hilton's Bookstore</h1>
      </header>
      
      <div className="row">
        
        {/* Left Sidebar for Categories */}
        <div className="col-md-3">
          <div className="p-3 bg-light border rounded">
            <h4 className="mb-3">Categories</h4>
            <CategoryFilter 
              selectedCategories={selectedCategories} 
              setSelectedCategories={setSelectedCategories} 
            />
          </div>
        </div>

        {/* Main Content Area for the Book List */}
        <div className="col-md-9">
          <BookList selectedCategories={selectedCategories} />
        </div>
        
      </div>
    </div>
  );
}

export default BooksPage;