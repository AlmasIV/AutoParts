using AutoParts.Model;
using System.Data;
using Microsoft.Data.SqlClient;

namespace AutoParts;

public class DatabaseAcess{
    private readonly string _connectionString;
    public DatabaseAcess(DatabaseAcessString connectionString){
        _connectionString = connectionString.ConnectionString;
    }

    public bool InsertData(AutoPart autoPart){
        bool isSuccess = false;
        using(SqlConnection connection = new SqlConnection(_connectionString)){
            using(SqlCommand command = new SqlCommand("InsertAutoPart", connection)){
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@Name", autoPart.Name);
                command.Parameters.AddWithValue("@Applicability", autoPart.Applicability);
                command.Parameters.AddWithValue("@Company", autoPart.Company);
                command.Parameters.AddWithValue("@PriceInRubles", autoPart.PriceInRubles);
                command.Parameters.AddWithValue("@PriceInTenge", autoPart.PriceInTenge);
                command.Parameters.AddWithValue("@Amount", autoPart.Amount);

                SqlParameter isSuccessful = new SqlParameter("@IsSuccessful", SqlDbType.Bit);
                isSuccessful.Direction = ParameterDirection.Output;
                command.Parameters.Add(isSuccessful);

                connection.Open();

                command.ExecuteNonQuery();

                isSuccess = Convert.ToBoolean(command.Parameters["@IsSuccessful"].Value);
            }
        }
        return isSuccess;
    }
    public (bool, List<AutoPart>?) RetrieveAll(){
        bool isSuccess = false;
        List<AutoPart>? autoParts = null;
        using(SqlConnection connection = new SqlConnection(_connectionString)){
            using(SqlCommand command = new SqlCommand("GetAutoParts", connection)){
                command.CommandType = CommandType.StoredProcedure;

                SqlParameter isSuccessful = new SqlParameter("@IsSuccessful", SqlDbType.Bit);
                isSuccessful.Direction = ParameterDirection.Output;
                command.Parameters.Add(isSuccessful);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                isSuccess = Convert.ToBoolean(command.Parameters["@IsSuccessful"]);

                if(isSuccess){
                    autoParts = new List<AutoPart>();
                    while(reader.Read()){
                        autoParts.Add(new AutoPart()
                        { 
                            Name = reader.GetString(1), 
                            Applicability = reader.GetString(2), 
                            Company = reader.GetString(3), 
                            PriceInRubles = reader.GetDecimal(4), 
                            PriceInTenge = reader.GetDecimal(5), 
                            Amount = reader.GetInt16(6) 
                        });
                    }
                }
            }
        }
        return (isSuccess, autoParts);
    }
}