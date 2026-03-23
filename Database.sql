-- 1. Criação das Tabelas
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

-- 2. Trigger de Auditoria (Gera o Log automaticamente)
CREATE TRIGGER trg_AuditProduto ON Produtos AFTER INSERT AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO LogsOperacoes (Descricao)
    SELECT 'Item "' + Nome + '" (Qtd: ' + CAST(Quantidade AS VARCHAR) + ') inserido via Dashboard.'
    FROM inserted;
END;
GO
