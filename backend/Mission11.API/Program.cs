using Microsoft.EntityFrameworkCore;
using Mission11.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// configuration to the databse
builder.Services.AddDbContext<BookstoreContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection"));
});

// Configure CORS to allow your React app to communicate with the backend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // From your professor's notes
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
