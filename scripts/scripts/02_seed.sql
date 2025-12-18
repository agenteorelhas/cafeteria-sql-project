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
