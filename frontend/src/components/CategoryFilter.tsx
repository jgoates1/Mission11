import { useState, useEffect } from 'react';

// Define the props so this component can communicate with App.tsx
interface CategoryFilterProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

function CategoryFilter({ selectedCategories, setSelectedCategories }: CategoryFilterProps) {
  // State to hold the master list of all possible categories from the database
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch the categories when the component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://goates-books-api-ebhygeevfyeteshf.westus2-01.azurewebsites.net/api/books/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle what happens when a user clicks a checkbox
  const handleCheckboxChange = (category: string) => {
    // If it's already selected, filter it out. Otherwise, add it to the array.
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category) 
      : [...selectedCategories, category]; 

    setSelectedCategories(updatedCategories);
  };

  return (
    <div className="d-flex flex-column align-items-start">
      {/* Map through the fetched categories and create a Bootstrap checkbox for each */}
      {categories.map((c) => (
        <div className="form-check mb-2" key={c}>
          <input
            className="form-check-input"
            type="checkbox"
            id={c}
            value={c}
            checked={selectedCategories.includes(c)}
            onChange={() => handleCheckboxChange(c)}
            style={{ cursor: 'pointer' }}
          />
          <label className="form-check-label" htmlFor={c} style={{ cursor: 'pointer' }}>
            {c}
          </label>
        </div>
      ))}
    </div>
  );
}

export default CategoryFilter;