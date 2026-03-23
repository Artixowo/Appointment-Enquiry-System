using AppointmentEnquiryAPI.Data;
using AppointmentEnquiryAPI.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
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

app.UseCors("AllowAll");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.MapGet("/api/enquiries", async (AppDbContext db) =>
    await db.Enquiries.OrderByDescending(e => e.DateCreated).ToListAsync())
    .WithName("GetEnquiries")
    .WithOpenApi();

app.MapPost("/api/enquiries", async (Enquiry enquiry, AppDbContext db) =>
{
    db.Enquiries.Add(enquiry);
    await db.SaveChangesAsync();
    return Results.Created($"/api/enquiries/{enquiry.Id}", enquiry);
})
.WithName("CreateEnquiry")
.WithOpenApi();

app.MapDelete("/api/enquiries/{id}", async (int id, AppDbContext db) =>
{
    var enquiry = await db.Enquiries.FindAsync(id);
    if (enquiry is null) return Results.NotFound();
    db.Enquiries.Remove(enquiry);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("DeleteEnquiry")
.WithOpenApi();

app.MapDelete("/api/enquiries", async (AppDbContext db) =>
{
    var enquiries = await db.Enquiries.ToListAsync();
    db.Enquiries.RemoveRange(enquiries);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("ClearAllEnquiries")
.WithOpenApi();

app.Run();
