-- Inserindo Categorias
INSERT INTO categorias (nome) VALUES ('Cafés'), ('Bebidas Geladas'), ('Salgados'), ('Doces');

-- Inserindo Produtos
INSERT INTO produtos (nome, preco, categoria_id) VALUES 
('Espresso', 5.50, 1),
('Capuccino', 9.00, 1),
('Frappuccino de Caramelo', 15.00, 2),
('Pão de Queijo', 4.50, 3),
('Coxinha', 7.00, 3),
('Bolo de Chocolate', 12.00, 4);

-- Inserindo Funcionários
INSERT INTO funcionarios (nome, cargo, data_admissao) VALUES 
('Alice Silva', 'Barista', '2025-01-10'),
('Bruno Souza', 'Atendente', '2025-02-15');

-- Inserindo Pedidos de exemplo
INSERT INTO pedidos (funcionario_id, total_pedido) VALUES (1, 14.50), (2, 15.00), (1, 24.00);

-- Inserindo Itens nos Pedidos
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, subtotal) VALUES 
(1, 1, 1, 5.50), -- 1 Espresso no pedido 1
(1, 2, 1, 9.00), -- 1 Capuccino no pedido 1
(2, 3, 1, 15.00),-- 1 Frappuccino no pedido 2
(3, 6, 2, 24.00);-- 2 Bolos no pedido 3

-- Inserindo Clientes
INSERT INTO clientes (nome, email) VALUES ('José Roberto', 'jose@email.com'), ('Maria Clara', 'maria@email.com');

-- Inserindo Ingredientes
INSERT INTO ingredientes (nome, quantidade_estoque, unidade_medida) VALUES 
('Grão de Café Arábica', 5000.00, 'g'),
('Leite Integral', 10000.00, 'ml'),
('Cacau em Pó', 1000.00, 'g');

-- Definindo a Ficha Técnica (Ex: O Capuccino usa Café e Leite)
-- Supondo que o produto 2 é o Capuccino
INSERT INTO ficha_tecnica (produto_id, ingrediente_id, quantidade_usada) VALUES 
(2, 1, 10.00), -- 10g de café
(2, 2, 150.00); -- 150ml de leite
