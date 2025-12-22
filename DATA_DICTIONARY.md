# 📖 Dicionário de Dados (Data Dictionary)
---
## 1. Tabela: produtos
---
* **Responsável pelo catálogo de itens comercializados. | Coluna | Tipo | Descrição | | :--- | :--- | :--- | | id | INT (PK) | Identificador único e incremental do produto. | | nome | VARCHAR | Nome comercial do item (ex: Espresso, Cappuccino). | | preco | DECIMAL | Preço de venda atual ao consumidor. | | ativo | BOOLEAN | Soft Delete: TRUE para disponível, FALSE para descontinuado. |*

## 2. Tabela: ingredientes (Estoque/Insumos)
---
* **Armazena as matérias-primas necessárias para a produção. | Coluna | Tipo | Descrição | | :--- | :--- | :--- | | id | INT (PK) | Identificador único do insumo. | | nome_ingrediente| VARCHAR | Nome da matéria-prima (ex: Café em Grãos, Leite Integral). | | quantidade_estoque| DECIMAL | Saldo atual em armazém (unidades/kg/ml). | | estoque_minimo | DECIMAL | Limite de segurança para alertas de reposição. |*

## 3. Tabela: pedidos (Cabeçalho de Venda)
---
* **Registra o evento da transação financeira. | Coluna | Tipo | Descrição | | :--- | :--- | :--- | | id | INT (PK) | Número único do pedido (Cupom Fiscal). | | data_pedido | TIMESTAMP | Data e hora exata da transação. | | funcionario_id | INT (FK) | Chave estrangeira ligada ao colaborador que realizou a venda. | | valor_total | DECIMAL | Soma total de todos os itens do pedido. |*

##4. Tabela: log_precos (Auditoria)
---
* **Tabela técnica alimentada por Triggers para histórico de alterações. | Coluna | Tipo | Descrição | | :--- | :--- | :--- | | id | INT (PK) | ID sequencial do evento de auditoria. | | produto_id | INT (FK) | Referência ao produto que teve o preço alterado. | | preco_antigo | DECIMAL | Valor que constava na tabela de produtos antes do update. | | preco_novo | DECIMAL | Novo valor inserido após a atualização. | | data_alteracao | TIMESTAMP | Carimbo de tempo do momento da alteração (Trigger-based). |*
