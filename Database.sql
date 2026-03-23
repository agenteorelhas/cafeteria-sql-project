CREATE DATABASE CafeSaaS;
GO

USE CafeSaaS;
GO

-- USUÁRIOS
CREATE TABLE Usuarios (
    ID INT PRIMARY KEY IDENTITY,
    Email VARCHAR(100) UNIQUE,
    SenhaHash VARCHAR(255)
);

-- PRODUTOS
CREATE TABLE Produtos (
    ID INT PRIMARY KEY IDENTITY,
    Nome VARCHAR(100),
    Preco DECIMAL(10,2),
    Quantidade INT,
    UsuarioID INT,
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(ID)
);

-- LOGS
CREATE TABLE LogsOperacoes (
    ID INT PRIMARY KEY IDENTITY,
    Descricao VARCHAR(255),
    DataHora DATETIME DEFAULT GETDATE()
);

-- USER PADRÃO
INSERT INTO Usuarios (Email, SenhaHash)
VALUES ('admin@admin.com', '123456'); -- depois a gente criptografa
