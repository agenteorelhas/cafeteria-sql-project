# 📖 Dicionário de Dados (Data Dictionary)
## 1. Tabela: produtos
* **Responsável pelo catálogo de itens comercializados. | Coluna | Tipo | Descrição | | :--- | :--- | :--- | | id | INT (PK) | Identificador único e incremental do produto. | | nome | VARCHAR | Nome comercial do item (ex: Espresso, Cappuccino). | | preco | DECIMAL | Preço de venda atual ao consumidor. | | ativo | BOOLEAN | Soft Delete: TRUE para disponível, FALSE para descontinuado. |*
## 2. Tabela: ingredientes (Estoque/Insumos)
* **
