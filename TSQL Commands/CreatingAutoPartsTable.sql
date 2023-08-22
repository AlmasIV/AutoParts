USE AutoPartsDB;
GO
CREATE TABLE AutoParts(
    Id INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
    [Name] NVARCHAR(MAX) NOT NULL,
    [Applicability] VARCHAR(MAX) NOT NULL,
    [Company] NVARCHAR(MAX),
    [PriceInRubles] SMALLMONEY,
    [PriceInTenge] SMALLMONEY
);