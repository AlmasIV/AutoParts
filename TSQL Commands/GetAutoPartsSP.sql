USE AutoPartsDB;
GO
CREATE PROCEDURE GetAutoParts
    
AS SELECT * FROM AutoParts LEFT JOIN Images ON Images.AutoPartId = AutoParts.Id