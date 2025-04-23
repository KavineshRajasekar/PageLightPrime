using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PageLimit.Models;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json;

namespace PageLimit.Controllers
{
    [Route("User")]
    public class UserController : Controller
    {
        public CommonResponse response = new CommonResponse();
        public string _ConnectionString = "Data Source=.;Initial Catalog=PageLimit;Integrated Security=True";

        [Route("")]
        public IActionResult UserName()
        {
            return View();
        }

        public class GetUserDetails_1 { 
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

        [HttpGet]
        [Route("GetUserDetails")]
        public IActionResult GetUserDetails(int? userId)
        {
            DataSet DS = new DataSet();
            using (SqlConnection connection = new SqlConnection(_ConnectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("[dbo].[GetUserDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@UserId", userId.HasValue ? userId.Value : (object)DBNull.Value);

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                   
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(DS);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);
                    
                }

                connection.Close();
            }
            List<UserData> userList = new List<UserData>();
            for (int i = 0; i < DS.Tables[0].Rows.Count; i++)
            {
                UserData userdetail = new UserData();
                userdetail.UserId = Convert.ToInt32(DS.Tables[0].Rows[i]["UserId"]);
                userdetail.Name = Convert.ToString(DS.Tables[0].Rows[i]["Name"]);
                userdetail.Gender = Convert.ToString(DS.Tables[0].Rows[i]["Gender"]);
                userdetail.Skill = Convert.ToString(DS.Tables[0].Rows[i]["Skill"]);
                userdetail.PhoneNo = Convert.ToString(DS.Tables[0].Rows[i]["PhoneNo"]);
                userdetail.Email = Convert.ToString(DS.Tables[0].Rows[i]["Email"]);
                userdetail.Address = Convert.ToString(DS.Tables[0].Rows[i]["Address"]);
                userdetail.CountryName = Convert.ToString(DS.Tables[0].Rows[i]["CountryName"]);
                userdetail.CountryId = Convert.ToInt32(DS.Tables[0].Rows[i]["CountryId"]);

                userList.Add(userdetail);
            }
            response.Data = userList;
            return Json(response);
        }

        public class DataCountry
        {
            public int CountryId { get; set; }
            public string CountryName { get; set; }
        }

        [HttpGet]
        [Route("GetCountryDetails")]
        public IActionResult GetCountryDetails(int? ModuleName)
        {
            DataSet DS = new DataSet();
            using (SqlConnection connection = new SqlConnection(_ConnectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("[dbo].[GetCountryDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@ModuleName", ModuleName.HasValue ? ModuleName.Value : (object)DBNull.Value);

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;


                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(DS);

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                }

                connection.Close();
            }

            List<DataCountry> CountryList = new List<DataCountry>();
            for (int i = 0; i < DS.Tables[0].Rows.Count; i++)
            {
                DataCountry Countrydetail = new DataCountry();
                Countrydetail.CountryId = Convert.ToInt32(DS.Tables[0].Rows[i]["CountryId"]);
                Countrydetail.CountryName = Convert.ToString(DS.Tables[0].Rows[i]["CountryName"]);

                CountryList.Add(Countrydetail);
            }
            response.Data = CountryList;
            return Json(response);
        }


        [HttpPost]
        [Route("InsertUpdateUser")]
        public IActionResult InsertUpdateUser([FromBody] InsertUpdateUser request)
        {
            string storedProcedure = (request.UserId != null)
                ? "[dbo].[UpdateUserDetails]"
                : "[dbo].[InsertUserDetails]";

            using (SqlConnection connection = new SqlConnection(_ConnectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(storedProcedure, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@Name", request.Name);
                    command.Parameters.AddWithValue("@Gender", request.Gender);
                    command.Parameters.AddWithValue("@Skill", request.Skill);
                    command.Parameters.AddWithValue("@PhoneNo", request.PhoneNo);
                    command.Parameters.AddWithValue("@Email", request.Email);
                    command.Parameters.AddWithValue("@Address", request.Address);
                    command.Parameters.AddWithValue("@CountryId", request.CountryId);

                    if (request.UserId > 0)
                    {
                        command.Parameters.AddWithValue("@UserId", request.UserId);
                    }

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    command.ExecuteNonQuery();

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                }
                connection.Close();
            }
            return Json(response);
        }

        [HttpPost]
        [Route("DeleteUserDetails")]
        public IActionResult DeleteUserDetails([FromBody] GetUserDetails_1 request)
        {
            using (SqlConnection connection = new SqlConnection(_ConnectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("[dbo].[DeleteUserDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@UserId", request.UserId);

                    command.Parameters.Add("@Status", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    command.Parameters.Add("@Message", SqlDbType.NVarChar, 500).Direction = ParameterDirection.Output;

                    command.ExecuteNonQuery();

                    response.Status = Convert.ToBoolean(command.Parameters["@Status"].Value);
                    response.Message = Convert.ToString(command.Parameters["@Message"].Value);

                }
                connection.Close();
            }
            return Json(response);
        }

    }
}
