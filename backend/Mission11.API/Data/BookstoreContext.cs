using Microsoft.EntityFrameworkCore;

namespace Mission11.API.Data;

public class BookstoreContext : DbContext
{
    // Constructor that passes options to the base DbContext class
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options) { }

    // This DbSet represents your 'Books' table in the database
    public DbSet<Book> Books { get; set; }
}