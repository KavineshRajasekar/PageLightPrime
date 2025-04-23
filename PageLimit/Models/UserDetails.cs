namespace PageLimit.Models
{
    public class InsertUpdateUser
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

    public class CommonResponse
    {
        public bool Status { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }
}
