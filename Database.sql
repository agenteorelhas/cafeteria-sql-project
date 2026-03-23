CREATE DATABASE CafeDB;
GO

USE CafeDB;
GO

CREATE TABLE Produtos (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nome VARCHAR(100) NOT NULL,
    Preco DECIMAL(10,2) NOT NULL,
    Quantidade INT NOT NULL,
    DataCadastro DATETIME DEFAULT GETDATE()
);

CREATE TABLE LogsOperacoes (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Descricao VARCHAR(255),
    DataHora DATETIME DEFAULT GETDATE()
);
GO

CREATE TRIGGER trg_AuditProduto
ON Produtos
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO LogsOperacoes (Descricao)
    SELECT 
        'Produto "' + Nome + '" inserido (Qtd: ' + CAST(Quantidade AS VARCHAR) + ')'
    FROM inserted;
END;
GO

-- DADOS INICIAIS
INSERT INTO Produtos (Nome, Preco, Quantidade)
VALUES 
('Grão Arábica', 45.00, 15),
('Café Expresso', 8.50, 50);
