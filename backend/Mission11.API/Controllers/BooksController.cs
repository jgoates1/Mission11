using Microsoft.AspNetCore.Mvc;
using Mission11.API.Data; // Matches the namespace from your Program.cs

namespace Mission11.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;

        // Constructor for Dependency Injection
        public BooksController(BookstoreContext temp)
        {
            _context = temp;
        }

        // The endpoint that returns the data
        // We add parameters with default values (pageNum = 1, pageSize = 5)
        // We also change the return type to IActionResult
        [HttpGet]
        // ADDED: [FromQuery] List<string>? category
        public IActionResult Get([FromQuery] List<string>? category, int pageNum = 1, int pageSize = 5, bool sortByTitle = false)
        {
            // 1. Start building the query (but don't execute it yet!)
            var query = _context.Books.AsQueryable();

            // 2. Apply Category Filter IF the user selected any
            if (category != null && category.Any())
            {
                // This checks if the book's Category is inside the list of selected categories
                query = query.Where(b => category.Contains(b.Category));
            }

            // 3. Apply Sorting IF the frontend asked for it
            if (sortByTitle)
            {
                query = query.OrderBy(b => b.Title);
            }

            // 4. Get the total count AFTER filtering (so pagination math works!)
            var totalNumBooks = query.Count();

            // 5. Apply pagination and execute the query with .ToList()
            var bookList = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // 6. Return the results
            return Ok(new { books = bookList, totalNumBooks });
        }
        
        // This creates a new endpoint at: api/books/categories
        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            // Reach into the database, select ONLY the Category column, 
            // filter out the duplicates with Distinct, and alphabetize them.
            var categories = _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c) 
                .ToList();

            return Ok(categories); // Returns the list of strings as JSON
        }
    }
}