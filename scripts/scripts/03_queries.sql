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
