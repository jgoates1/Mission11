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
        public IActionResult Get(int pageNum = 1, int pageSize = 5, bool sortByTitle = false)
        {
            // 1. Get the total count
            var totalNumBooks = _context.Books.Count();

            // 2. Start building the query (but don't execute it yet!)
            var query = _context.Books.AsQueryable();

            // 3. Conditionally apply the sorting IF the frontend asked for it
            if (sortByTitle)
            {
                query = query.OrderBy(b => b.Title);
            }

            // 4. Finally, apply the pagination and execute the query with .ToList()
            var bookList = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // 5. Return the results
            return Ok(new { books = bookList, totalNumBooks });
        }
    }
}