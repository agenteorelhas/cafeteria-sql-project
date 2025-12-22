# ☕ Cafeteria SQL Project

Projeto de modelagem e análise de dados de uma cafeteria utilizando SQL.

![SQL](https://img.shields.io/badge/SQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)
![Database](https://img.shields.io/badge/Database_Design-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Data_Modeling](https://img.shields.io/badge/Data_Modeling-FF6F00?style=for-the-badge&logo=diagrams.net&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Status](https://img.shields.io/badge/Status-Concluído-brightgreen?style=for-the-badge)

---

## 🚀 Navegação Rápida
* [📊 **Casos de Uso**](documents/USE_CASES.md) - Entenda como o projeto resolve problemas reais de negócio.
* [📝 **Dicionário de Dados**](documents/DATA_DICTIONARY.md) - Definição técnica de cada tabela e coluna.
* [💻 **Scripts SQL**](./scripts/) - Estrutura, massa de dados e lógica programada.

---

## 📑 Sumário
* [📌 Sobre o Projeto](#-sobre-o-projeto)
* [📐 Modelagem (ERD)](#-modelo-entidade-relacionamento)
* [🔄 Fluxo de Dados](#-fluxo-de-dados-e-linhagem-data-lineage)
* [📊 Visualização BI](#-visualização-de-dados-bi)
* [🏆 Competências](#-competências-demonstradas)
* [🛠️ Como Executar](#️-como-executar-o-projeto)

---

## 📌 Sobre o Projeto
Este repositório contém a modelagem completa de um banco de dados para uma cafeteria, incluindo o script de criação, inserção de dados e consultas analíticas.

## 🛠️ Tecnologias Utilizadas
* **SQL** (PostgreSQL/MySQL)
* **GitHub** para versionamento
* **dbdiagram.io** para modelagem

---

## 📐 Modelo Entidade-Relacionamento
![Diagrama ER](imagens/Cafeteria.png)

> 🔗 **Acesse a versão interativa:** [Visualizar no dbdiagram.io](https://dbdiagram.io/d/Cafeteria-6944645a4bbde0fd74c0c833)

[![Database Schema](https://img.shields.io/badge/dbdiagram.io-Modelo_ER_Interativo-blue?style=for-the-badge&logo=databricks&logoColor=white)](https://dbdiagram.io/d/Cafeteria-6944645a4bbde0fd74c0c833)

---

## 📊 Perguntas que este banco responde:
1. Qual o faturamento total por dia?
2. Quais são os 3 produtos mais vendidos?
3. Qual funcionário realizou mais vendas?

![Banner do Projeto](imagens/imagem_2025-12-18_175502109.png)

---

## 🛡️ Segurança e Performance 🔐
* **Triggers:** Auditoria automática de preços na tabela `log_precos`.
* **Views:** Visão `v_resumo_vendas_por_produto` para simplificar relatórios.
* **Indexes:** Índices B-Tree para buscas rápidas em `email` e `data_pedido`.
* **Soft Delete:** O sistema utiliza exclusão lógica (coluna `ativo`). Isto garante a manutenção da **Integridade Referencial**, permitindo que o histórico de vendas permaneça intacto mesmo após um produto ser retirado do catálogo.

---

## 🔄 Fluxo de Dados e Linhagem (Data Lineage)

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
