using AppointmentEnquiryAPI.Models;

namespace AppointmentEnquiryAPI.Services;

public interface IEnquiryService
{
    Task<List<Enquiry>> GetAllAsync();
    Task<Enquiry> CreateAsync(Enquiry enquiry);
    Task<bool> DeleteAsync(int id);
    Task ClearAllAsync();
}
