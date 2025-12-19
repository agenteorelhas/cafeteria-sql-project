# cafeteria-sql-project
Projeto de modelagem e análise de dados de uma cafeteria utilizando SQL.

# ☕ Cafeteria SQL Project

## 📌 Sobre o Projeto
Este repositório contém a modelagem completa de um banco de dados para uma cafeteria, incluindo o script de criação, inserção de dados e consultas analíticas.

## 🛠️ Tecnologias Utilizadas
* SQL (PostgreSQL/MySQL)
* GitHub para versionamento
* dbdiagram.io para modelagem

## 📐 Modelo Entidade-Relacionamento
![Diagrama ER](Cafeteria.png)

## 📊 Perguntas que este banco responde:
1. Qual o faturamento total por dia?
2. Quais são os 3 produtos mais vendidos?
3. Qual funcionário realizou mais vendas?

![Banner do Projeto](imagem_2025-12-18_175502109.png)

## 📖 Dicionário de Dados

Abaixo, detalhamos a função de cada tabela e suas principais colunas:

### 🛒 Vendas e Clientes
* **clientes**: Armazena informações dos consumidores para programas de fidelidade.
    * `email`: Campo único para evitar cadastros duplicados.
* **pedidos**: Registro de cada venda realizada.
    * `cliente_id`: Chave estrangeira que liga a compra a um cliente.
* **itens_pedido**: Detalhamento de produtos por pedido.

### ☕ Gestão de Produtos e Estoque
* **produtos**: Catálogo de itens vendidos.
* **categorias**: Organização (Bebidas, Salgados, Doces).
* **ingredientes**: Controle de insumos (café, leite, açúcar).
* **ficha_tecnica**: Relacionamento **N:N** que define a composição de cada produto.

### 👥 Recursos Humanos
* **funcionarios**: Cadastro de colaboradores e vendedores.

### 🛡️ Segurança e Performance
* **Triggers**: Auditoria automática de preços na tabela `log_precos`.
* **Views**: Visão `v_resumo_vendas_por_produto` para simplificar relatórios.
* **Indexes**: Índices B-Tree para buscas rápidas em `email` e `data_pedido`.

---

## 🔄 Fluxo de Dados e Linhagem (Data Lineage)

O ciclo de vida dos dados segue o percurso estruturado abaixo:

1. **Entrada:** O dado nasce via Stored Procedure `sp_registrar_venda`.
2. **Detalhamento:** Itens são registrados em `itens_pedido`.
3. **Estoque:** O sistema consulta a `ficha_tecnica` e abate `ingredientes` automaticamente.
4. **Auditoria:** Triggers monitoram alterações em `produtos`.
5. **Saída/BI:** Views consolidam dados para Insights.

```mermaid
graph LR
    A[Cliente/Pedido] --> B(sp_registrar_venda)
    B --> C{Transação SQL}
    C --> D[pedidos / itens_pedido]
    D --> E[ficha_tecnica]
    E --> F[Atualiza Estoque]
    D --> G[View de Faturamento]
    G --> H((Insights BI))
    
    subgraph Auditoria
    I[produtos] -- Alteração de Preço --> J(Trigger)
    J --> K[log_precos]
    end
