USE AutoPartsDB;
GO
CREATE TABLE AutoParts(
    Id INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
    [Name] NVARCHAR(MAX) NOT NULL,
    [Applicability] VARCHAR(MAX) NOT NULL,
    [Company] NVARCHAR(MAX),
    [PriceInRubles] SMALLMONEY CONSTRAINT DF_PriceInRubles DEFAULT 0,
    [PriceInTenge] SMALLMONEY CONSTRAINT DF_PriceInTenge DEFAULT 0,
    [Amount] SMALLINT NOT NULL CONSTRAINT DF_Amount DEFAULT 0,
    CreatedDate DATETIME2 NOT NULL CONSTRAINT DF_CreatedDate DEFAULT GETDATE()
);