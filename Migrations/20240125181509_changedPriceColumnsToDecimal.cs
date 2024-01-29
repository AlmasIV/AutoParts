using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoParts.Migrations
{
    /// <inheritdoc />
    public partial class changedPriceColumnsToDecimal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "PriceInTenge",
                table: "AutoParts",
                type: "decimal(10,2)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "PriceInRubles",
                table: "AutoParts",
                type: "decimal(10,2)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PriceInTenge",
                table: "AutoParts",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(10,2)");

            migrationBuilder.AlterColumn<int>(
                name: "PriceInRubles",
                table: "AutoParts",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(10,2)");
        }
    }
}
