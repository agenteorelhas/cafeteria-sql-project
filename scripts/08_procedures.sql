DELIMITER //

CREATE PROCEDURE sp_registrar_venda(
    IN p_funcionario_id INT,
    IN p_produto_id INT,
    IN p_quantidade INT
)
BEGIN
    DECLARE v_preco_unitario DECIMAL(10,2);
    DECLARE v_total DECIMAL(10,2);
    DECLARE v_pedido_id INT;

    -- 1. Busca o preço do produto
    SELECT preco INTO v_preco_unitario FROM produtos WHERE id = p_produto_id;
    
    -- 2. Calcula o valor total
    SET v_total = v_preco_unitario * p_quantidade;

    -- INÍCIO DA TRANSAÇÃO (Garante que ou faz tudo ou não faz nada)
    START TRANSACTION;

    -- 3. Cria o cabeçalho do pedido
    INSERT INTO pedidos (funcionario_id, total_pedido) 
    VALUES (p_funcionario_id, v_total);
    
    -- 4. Recupera o ID do pedido que acabou de ser criado
    SET v_pedido_id = LAST_INSERT_ID();

    -- 5. Insere os itens do pedido
    INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, subtotal)
    VALUES (v_pedido_id, p_produto_id, p_quantidade, v_total);

    -- 6. ATUALIZAÇÃO AUTOMÁTICA DE ESTOQUE
    -- Aqui subtraímos os ingredientes baseados na ficha técnica
    UPDATE ingredientes i
    JOIN ficha_tecnica ft ON i.id = ft.ingrediente_id
    SET i.quantidade_estoque = i.quantidade_estoque - (ft.quantidade_usada * p_quantidade)
    WHERE ft.produto_id = p_produto_id;

    COMMIT;
    
    SELECT 'Venda realizada e estoque atualizado com sucesso!' AS Mensagem;
END //

DELIMITER ;

CREATE PROCEDURE sp_desativar_produto(p_id INT)
BEGIN
    UPDATE produtos 
    SET ativo = FALSE 
    WHERE id = p_id;
    
    -- Log opcional: você pode disparar um aviso se o produto tiver stock parado
END;
