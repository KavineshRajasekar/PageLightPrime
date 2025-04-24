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
            //List<UserData> userList = new List<UserData>();
            //for (int i = 0; i < DS.Tables[0].Rows.Count; i++)
            //{
            //    UserData userdetail = new UserData();
            //    userdetail.UserId = Convert.ToInt32(DS.Tables[0].Rows[i]["UserId"]);
            //    userdetail.Name = Convert.ToString(DS.Tables[0].Rows[i]["UserName"]);
            //    userdetail.Gender = Convert.ToString(DS.Tables[0].Rows[i]["Gender"]);
            //    userdetail.Skill = Convert.ToString(DS.Tables[0].Rows[i]["Skill"]);
            //    userdetail.PhoneNo = Convert.ToString(DS.Tables[0].Rows[i]["PhoneNo"]);
            //    userdetail.Email = Convert.ToString(DS.Tables[0].Rows[i]["Email"]);
            //    userdetail.Address = Convert.ToString(DS.Tables[0].Rows[i]["Address"]);
            //    userdetail.CountryName = Convert.ToString(DS.Tables[0].Rows[i]["Country"]);
            //    userdetail.CountryId = Convert.ToInt32(DS.Tables[0].Rows[i]["CountryId"]);

            //    userList.Add(userdetail);
            //}
            //response.Data = userList;

            response.Data = JsonConvert.DeserializeObject<List<UserData>>(JsonConvert.SerializeObject(DS.Tables[0]));
            return Json(response);
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
            using (SqlConnection connection = new SqlConnection(_ConnectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("[dbo].[InsertOrUpdateUserDetails]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@TVP_UserDetails", ConvertToDataTable(request.UserDetails));

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

        private DataTable ConvertToDataTable(List<UserDetails> userDetails)
        {

            DataTable dt = JsonConvert.DeserializeObject<DataTable>(JsonConvert.SerializeObject(userDetails));
            //DataTable dt = new DataTable();

            //dt.Columns.Add("UserId", typeof(int));
            //dt.Columns.Add("Name", typeof(string));
            //dt.Columns.Add("Gender", typeof(string));
            //dt.Columns.Add("Skill", typeof(string));
            //dt.Columns.Add("PhoneNo", typeof(string));
            //dt.Columns.Add("Email", typeof(string));
            //dt.Columns.Add("Address", typeof(string));
            //dt.Columns.Add("CountryId", typeof(int));

            //foreach (var user in userDetails)
            //{
            //    DataRow row = dt.NewRow();
            //    row["UserId"] = user.UserId ?? 0;
            //    row["Name"] = user.Name;
            //    row["Gender"] = user.Gender;
            //    row["Skill"] = user.Skill;
            //    row["PhoneNo"] = user.PhoneNo;
            //    row["Email"] = user.Email;
            //    row["Address"] = user.Address ?? "";
            //    row["CountryId"] = user.CountryId;
            //    dt.Rows.Add(row);
            //}

            return dt;
        }
    }
}
