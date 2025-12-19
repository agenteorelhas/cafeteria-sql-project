-- ==========================================
-- 1. SISTEMA DE AUDITORIA DE PREÇOS
-- ==========================================

CREATE TABLE log_precos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    produto_id INT,
    preco_antigo DECIMAL(10,2),
    preco_novo DECIMAL(10,2),
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER tg_auditoria_precos
AFTER UPDATE ON produtos
FOR EACH ROW
BEGIN
    IF OLD.preco <> NEW.preco THEN
        INSERT INTO log_precos (produto_id, preco_antigo, preco_novo)
        VALUES (OLD.id, OLD.preco, NEW.preco);
    END IF;
END; //
DELIMITER ;

-- ==========================================
-- 2. VIEW PARA O GERENTE (Relatório Simplificado)
-- ==========================================

CREATE VIEW v_resumo_vendas_por_produto AS
SELECT 
    p.nome AS produto,
    SUM(ip.quantidade) AS total_unidades,
    SUM(ip.subtotal) AS faturamento_total
FROM produtos p
JOIN itens_pedido ip ON p.id = ip.produto_id
GROUP BY p.nome;

-- ==========================================
-- 3. OTIMIZAÇÃO DE PERFORMANCE
-- ==========================================

-- Criando índices para buscas rápidas por email de cliente e data de pedido
CREATE INDEX idx_cliente_email ON clientes(email);
CREATE INDEX idx_pedido_data ON pedidos(data_pedido);
