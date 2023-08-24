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
        Console.WriteLine(_connectionString);
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
}