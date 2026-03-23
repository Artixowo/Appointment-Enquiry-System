using System.ComponentModel.DataAnnotations;

namespace AppointmentEnquiryAPI.Models;

public class Enquiry
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Phone]
    public string Phone { get; set; } = string.Empty;

    [Required]
    public string EnquiryType { get; set; } = string.Empty;

    [Required]
    public DateTime PreferredDate { get; set; }

    public string Notes { get; set; } = string.Empty;

    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
}