namespace AutoParts;

public class DatabaseAcess {
    private readonly string _connectionString;
    private readonly IConfiguration _configuration;
    public DatabaseAcess(IConfiguration configuration){
        _configuration = configuration;
        _connectionString = configuration.GetConnectionString("LocalConnectionString")!;
    }
}