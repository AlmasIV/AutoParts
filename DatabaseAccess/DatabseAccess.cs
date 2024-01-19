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
        List<AutoPart>? autoParts = null;
        using(SqlConnection connection = new SqlConnection(_connectionString)){
            using(SqlCommand command = new SqlCommand("GetAutoParts", connection)){
                command.CommandType = CommandType.StoredProcedure;
                try{
                    connection.Open();

                    using(SqlDataReader reader = command.ExecuteReader()){
                        autoParts = new List<AutoPart>();
                        while(reader.Read()){
                            autoParts.Add(new AutoPart()
                            {
                                Id = reader.GetInt32(0), 
                                Name = reader.GetString(1), 
                                Applicability = reader.GetString(2), 
                                Company = reader.IsDBNull(3) ? null : reader.GetString(3), 
                                PriceInRubles = reader.GetDecimal(4), 
                                PriceInTenge = reader.GetDecimal(5), 
                                Amount = reader.GetInt16(6) 
                            });
                        }
                    }
                    return (autoParts != null, autoParts);
                }
                catch {
                    return (false, null);
                }
            }
        }
    }
    public List<AutoPart>? RetrieveByIds(IEnumerable<int> ids){
        using(SqlConnection connection = new SqlConnection(_connectionString)){
            try{
                connection.Open();
                using(SqlCommand command = new SqlCommand("USE AutoPartsDB;", connection)){
                    command.ExecuteNonQuery();
                }
                using(SqlCommand command = new SqlCommand()){
                    command.Connection = connection;
                    string commandText = "SELECT * FROM AutoParts WHERE Id IN ";
                    for(int i = 0, n = ids.Count(); i < n; i ++){
                        if(i == n - 1){
                            commandText += i + ");";
                        }
                        else{
                            commandText += i + ", ";
                        }
                    }
                    command.CommandText = commandText;
                    using(SqlDataReader reader = command.ExecuteReader()){
                        List<AutoPart> autoParts = new List<AutoPart>();
                        while(reader.Read()){
                            autoParts.Add(new AutoPart(){
                                Id = reader.GetInt32(0), 
                                Name = reader.GetString(1), 
                                Applicability = reader.GetString(2), 
                                Company = reader.IsDBNull(3) ? null : reader.GetString(3), 
                                PriceInRubles = reader.GetDecimal(4), 
                                PriceInTenge = reader.GetDecimal(5), 
                                Amount = reader.GetInt16(6) 
                            });
                        }
                        return autoParts;
                    }
                }
            }
            catch{
                return null;
            }
        }
    }
}