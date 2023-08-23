namespace AutoParts;

public class DatabaseAcessString {
    private readonly string _connectionString;
    private readonly IConfiguration _configuration;
    public string ConnectionString {
        get {
            return _connectionString;
        }
    }
    public DatabaseAcessString(IConfiguration configuration){
        _configuration = configuration;
        _connectionString = configuration.GetConnectionString("LocalConnectionString")!;
    }
}