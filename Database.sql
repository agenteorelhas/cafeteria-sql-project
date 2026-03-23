CREATE TABLE Produtos (
    ID INT PRIMARY KEY IDENTITY,
    Nome VARCHAR(100),
    Preco DECIMAL(10,2),
    Quantidade INT
);

CREATE TABLE LogsOperacoes (
    ID INT PRIMARY KEY IDENTITY,
    Descricao VARCHAR(255),
    DataHora DATETIME DEFAULT GETDATE()
);
GO

CREATE TRIGGER trg_AuditProduto ON Produtos AFTER INSERT AS
BEGIN
    INSERT INTO LogsOperacoes (Descricao)
    SELECT 'Produto cadastrado: ' + Nome FROM inserted;
END;
