using AppointmentEnquiryAPI.Data;
using AppointmentEnquiryAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AppointmentEnquiryAPI.Services;

public class EnquiryService : IEnquiryService
{
    private readonly AppDbContext _db;

    public EnquiryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Enquiry>> GetAllAsync()
    {
        return await _db.Enquiries.OrderByDescending(e => e.DateCreated).ToListAsync();
    }

    public async Task<Enquiry> CreateAsync(Enquiry enquiry)
    {
        _db.Enquiries.Add(enquiry);
        await _db.SaveChangesAsync();
        return enquiry;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var enquiry = await _db.Enquiries.FindAsync(id);
        if (enquiry is null) return false;
        _db.Enquiries.Remove(enquiry);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task ClearAllAsync()
    {
        var enquiries = await _db.Enquiries.ToListAsync();
        _db.Enquiries.RemoveRange(enquiries);
        await _db.SaveChangesAsync();
    }
}
