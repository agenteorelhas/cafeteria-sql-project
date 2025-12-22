CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE produtos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE funcionarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50),
    data_admissao DATE
);

CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    funcionario_id INT,
    total_pedido DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

CREATE TABLE itens_pedido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT,
    produto_id INT,
    quantidade INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Criando Clientes
CREATE TABLE clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    pontos_fidelidade INT DEFAULT 0
);

-- Adicionando a coluna cliente_id na tabela pedidos para rastrear quem comprou
ALTER TABLE pedidos ADD COLUMN cliente_id INT;
ALTER TABLE pedidos ADD FOREIGN KEY (cliente_id) REFERENCES clientes(id);

-- Criando Ingredientes
CREATE TABLE ingredientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    estoque_atual DECIMAL(10,2)
);

-- Tabela de Ficha Técnica (Relacionamento N:N entre Produtos e Ingredientes)
CREATE TABLE ficha_tecnica (
    produto_id INT,
    ingrediente_id INT,
    quantidade_necessaria DECIMAL(10,2),
    PRIMARY KEY (produto_id, ingrediente_id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (ingrediente_id) REFERENCES ingredientes(id)
);

-- Adicionando a coluna
ALTER TABLE produtos ADD COLUMN ativo BOOLEAN DEFAULT TRUE;

-- Em vez de DELETE, usamos:
UPDATE produtos SET ativo = FALSE WHERE id = 10;
);

CREATE PROCEDURE sp_alerta_estoque_critico()
BEGIN
    SELECT nome_ingrediente, quantidade_estoque 
    FROM ingredientes 
    WHERE quantidade_estoque < estoque_minimo;
END;

-- Adicionando controle de estado para Produtos e Clientes
ALTER TABLE produtos ADD COLUMN ativo BOOLEAN DEFAULT TRUE;
ALTER TABLE clientes ADD COLUMN ativo BOOLEAN DEFAULT TRUE;
ALTER TABLE funcionarios ADD COLUMN ativo BOOLEAN DEFAULT TRUE;

-- Criando um índice para performance (já que filtraremos muito por ativos)
CREATE INDEX idx_produtos_ativos ON produtos(id) WHERE ativo = TRUE;
