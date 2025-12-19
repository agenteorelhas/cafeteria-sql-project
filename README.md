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

Abaixo, detalhamos a função de cada tabela e suas principais colunas para facilitar a compreensão da arquitetura:

### 🛒 Vendas e Clientes
* **clientes**: Armazena informações dos consumidores para programas de fidelidade.
    * `email`: Campo único para evitar cadastros duplicados.
* **pedidos**: Registro de cada venda realizada.
    * `cliente_id`: Chave estrangeira que liga a compra a um cliente (Opcional - permite vendas anônimas).
* **itens_pedido**: Tabela detalhada que lista quais produtos compõem cada pedido.

### ☕ Gestão de Produtos e Estoque
* **produtos**: Catálogo de itens vendidos na cafeteria.
* **categorias**: Organização dos produtos (ex: Bebidas, Salgados, Doces).
* **ingredientes**: Controle de insumos brutos (café em grão, leite, açúcar).
* **ficha_tecnica**: Tabela de relacionamento **Muitos para Muitos (N:N)**. Define quais ingredientes e em qual quantidade são necessários para produzir cada item do cardápio.

### 👥 Recursos Humanos
* **funcionarios**: Cadastro de colaboradores que operam o sistema e realizam as vendas.

### 🛡️ Segurança e Performance (Funcionalidades Avançadas)
* **Triggers**: Implementado gatilho para auditoria de preços, registrando automaticamente qualquer alteração de valores na tabela `log_precos`.
* **Views**: Criada a visão `v_resumo_vendas_por_produto` para simplificar a geração de relatórios de BI.
* **Indexes**: Aplicação de índices B-Tree nas colunas de busca frequente (`email` e `data_pedido`) para garantir consultas rápidas mesmo com grande volume de dados.

![SQL](https://img.shields.io/badge/Language-SQL-blue)
![Database](https://img.shields.io/badge/DB-PostgreSQL-darkblue)
![Status](https://img.shields.io/badge/Status-Completed-green)
![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)

---

## 🔄 Fluxo de Dados e Linhagem (Data Lineage)

Para garantir a transparência e a integridade, o ciclo de vida dos dados neste sistema segue um percurso estruturado:

1.  **Entrada de Pedido:** O dado nasce na tabela `pedidos` através da Stored Procedure `sp_registrar_venda`.
2.  **Detalhamento:** Os itens individuais são registrados em `itens_pedido`, vinculando produtos ao pedido.
3.  **Processamento de Estoque:** O sistema consulta a `ficha_tecnica` e subtrai os `ingredientes` automaticamente.
4.  **Auditoria:** Alterações de preços são capturadas por uma `Trigger` e salvas em `log_precos`.
5.  **Saída/BI:** Os dados são consolidados pela **View** `v_resumo_vendas_por_produto` para relatórios gerenciais.

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
-----------------------
### 💾 Backup e Recuperação
O banco de dados está configurado para suportar backups lógicos via mysqldump (ou pg_dump), garantindo que a recuperação de desastres possa ser feita em minutos, preservando a integridade das transações e o histórico de auditoria.
