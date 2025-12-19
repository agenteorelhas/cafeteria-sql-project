-- 1. Ranking de Produtos mais vendidos
SELECT p.nome, SUM(i.quantidade) AS total_vendido
FROM produtos p
JOIN itens_pedido i ON p.id = i.produto_id
GROUP BY p.nome
ORDER BY total_vendido DESC;

-- 2. Faturamento total por funcionário
SELECT f.nome, SUM(p.total_pedido) AS total_vendas
FROM funcionarios f
JOIN pedidos p ON f.id = p.funcionario_id
GROUP BY f.nome;

-- 3. Lista de produtos e suas respectivas categorias
SELECT p.nome AS Produto, c.nome AS Categoria, p.preco
FROM produtos p
INNER JOIN categorias c ON p.categoria_id = c.id;

-- 1. CONSULTA DE ESTOQUE: Ver quais ingredientes são usados em cada produto
SELECT p.nome AS Produto, i.nome AS Ingrediente, f.quantidade_usada
FROM produtos p
JOIN ficha_tecnica f ON p.id = f.produto_id
JOIN ingredientes i ON f.ingrediente_id = i.id;

-- 2. CRM: Ver quais clientes nunca fizeram um pedido (para mandar promoção)
SELECT c.nome, c.email
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
WHERE p.id IS NULL;

-- 3. ANALÍTICO: Gasto total por cliente
SELECT c.nome, SUM(p.total_pedido) as total_gasto
FROM clientes c
JOIN pedidos p ON c.id = p.cliente_id
GROUP BY c.nome
ORDER BY total_gasto DESC;
