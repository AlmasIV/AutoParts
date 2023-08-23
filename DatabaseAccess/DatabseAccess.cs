namespace AutoParts;

public class DatabaseAcess{
    private readonly string _connectionString;
    public DatabaseAcess(DatabaseAcessString connectionString){
        _connectionString = connectionString.ConnectionString;
    }
    
}