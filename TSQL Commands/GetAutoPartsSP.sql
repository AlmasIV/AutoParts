USE AutoPartsDB;
GO
CREATE PROCEDURE GetAutoParts
    @IsSuccessful BIT OUTPUT
AS
BEGIN TRY
    SELECT * FROM AutoParts LEFT JOIN Images ON Images.AutoPartId = AutoParts.Id
    SET @IsSuccessful = 1;
END TRY
BEGIN CATCH
    SET @IsSuccessful = 0;
END CATCH;