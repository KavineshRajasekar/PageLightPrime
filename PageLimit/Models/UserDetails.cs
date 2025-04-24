using System.Data;

namespace PageLimit.Models
{
    public class InsertUpdateUser{
        public List<UserDetails> UserDetails { get; set; }
    }

    public class UserDetails
    {
        public int? UserId { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public string Skill { get; set; }
        public string PhoneNo { get; set; }
        public string Email { get; set; }
        public string? Address { get; set; }
        public int CountryId { get; set; }
    }

    public class DataCountry
    {
        public int CountryId { get; set; }
        public string CountryName { get; set; }
    }

    public class CommonResponse
    {
        public bool Status { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }

    public class GetUserDetails_1
    {
        public int? UserId { get; set; }
    }

    public class UserData
    {
        public int? UserId { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public string Skill { get; set; }
        public string PhoneNo { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string CountryName { get; set; }
        public int? CountryId { get; set; }
    }
}
