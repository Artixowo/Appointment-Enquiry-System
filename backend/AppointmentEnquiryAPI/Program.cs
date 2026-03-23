using AppointmentEnquiryAPI.Data;
using AppointmentEnquiryAPI.Models;
using AppointmentEnquiryAPI.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IEnquiryService, EnquiryService>();

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

    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

var enquiries = app.MapGroup("/api/enquiries");

enquiries.MapGet("", async (IEnquiryService service) =>
    await service.GetAllAsync())
    .WithName("GetEnquiries")
    .WithOpenApi();

enquiries.MapPost("", async (Enquiry enquiry, IEnquiryService service) =>
{
    var created = await service.CreateAsync(enquiry);
    return Results.Created($"/api/enquiries/{created.Id}", created);
})
.WithName("CreateEnquiry")
.WithOpenApi();

enquiries.MapDelete("/{id}", async (int id, IEnquiryService service) =>
{
    return await service.DeleteAsync(id) ? Results.NoContent() : Results.NotFound();
})
.WithName("DeleteEnquiry")
.WithOpenApi();

enquiries.MapDelete("", async (IEnquiryService service) =>
{
    await service.ClearAllAsync();
    return Results.NoContent();
})
.WithName("ClearAllEnquiries")
.WithOpenApi();

app.Run();
