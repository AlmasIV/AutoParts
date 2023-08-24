USE AutoPartsDB;
GO
CREATE PROCEDURE InsertAutoPart
    @Name NVARCHAR(MAX),
    @Applicability VARCHAR(MAX),
    @Company NVARCHAR(MAX) = NULL,
    @PriceInRubles SMALLMONEY = 0,
    @PriceInTenge SMALLMONEY = 0,
    @Amount SMALLINT = 0,
    @IsSuccessful BIT OUTPUT
AS
BEGIN TRANSACTION InsertAutoPartTransaction WITH MARK 'InsertAutoPart';
BEGIN TRY
    
    INSERT INTO AutoParts([Name], Applicability, Company, PriceInRubles, PriceInTenge, Amount) VALUES
    (@Name, @Applicability, @Company, @PriceInRubles, @PriceInTenge, @Amount);

    SET @IsSuccessful = 1;

    COMMIT TRANSACTION

END TRY
BEGIN CATCH

    SET @IsSuccessful = 0;
    ROLLBACK;

END CATCH;