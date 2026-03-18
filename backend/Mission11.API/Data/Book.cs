using System.ComponentModel.DataAnnotations;

namespace Mission11.API.Data
{
    public class Book
    {
        [Key]
        public int BookId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Publisher { get; set; } = string.Empty;
        public string Isbn { get; set; } = string.Empty;
        public string Classification { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int PageCount { get; set; }
        public double Price { get; set; }
    }
}