using Microsoft.EntityFrameworkCore;
using AppointmentEnquiryAPI.Models;

namespace AppointmentEnquiryAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Enquiry> Enquiries { get; set; }
}