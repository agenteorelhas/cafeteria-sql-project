-- TESTE 1: Verificar se há produtos com preço inválido
SELECT * FROM produtos WHERE preco <= 0;

-- TESTE 2: Verificar se o estoque de algum ingrediente ficou negativo (Erro de lógica)
SELECT * FROM ingredientes WHERE quantidade_estoque < 0;

-- TESTE 3: Verificar integridade de pedidos (Pedidos sem itens)
SELECT p.id FROM pedidos p 
LEFT JOIN itens_pedido ip ON p.id = ip.pedido_id 
WHERE ip.id IS NULL;
