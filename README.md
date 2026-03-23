# ☕ Espresso SQL Admin
Projeto Full-Stack de gestão para cafeterias, integrando **SQL Server**, **Node.js** e uma interface moderna em **Glassmorphism**.

![SQL Server](https://img.icons8.com/color/48/000000/microsoft-sql-server.png) ![Nodejs](https://img.icons8.com/color/48/000000/nodejs.png) ![JavaScript](https://img.icons8.com/color/48/000000/javascript--v1.png) ![CSS3](https://img.icons8.com/color/48/000000/css3.png)

---

## 🚀 Evolução V2.0 (Full-Stack)
O projeto deixou de ser apenas uma modelagem de dados estática para se tornar uma aplicação funcional completa. As principais atualizações incluem:

* **🎨 UI "Purple Dracula":** Interface escura com efeitos de vidro (*glassmorphism*) e acentos em roxo e marrom café.
* **📊 Gauge em Tempo Real:** Um gráfico de velocímetro animado que monitora o nível de estoque de grãos.
* **📡 Backend Reativo:** Servidor em Node.js que conecta a interface diretamente ao banco de dados SQL Server.
* **📜 Terminal de Logs SQL:** Visualização em tempo real das operações processadas por Triggers no banco.

---

## 📑 Sumário
* [📌 Arquitetura do Sistema](#-arquitetura-do-sistema)
* [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
* [📐 Modelagem SQL & Banco de Dados](#-modelagem-sql--banco-de-dados)
* [💻 Funcionalidades da Interface](#-funcionalidades-da-interface)
* [🏆 Competências Demonstradas](#-competências-demonstradas)
* [⚙️ Como Executar](#️-como-executar)

---

## 📌 Arquitetura do Sistema
O ecossistema do projeto é dividido em três camadas principais:
1.  **Client (Front-end):** SPA (Single Page Application) construída com HTML5 e CSS3 moderno, utilizando Vanilla JS para manipulação de DOM.
2.  **Server (API):** Middleware em Node.js com Express e biblioteca `mssql` para transações seguras.
3.  **Database:** SQL Server processando a lógica de negócio através de Triggers de auditoria e Procedures.

---

## 🛠️ Tecnologias Utilizadas
* **Back-end:** Node.js, Express.js, CORS, MSSQL Driver.
* **Database:** Microsoft SQL Server (T-SQL).
* **Front-end:** CSS Grid & Flexbox, Particles.js (efeitos de fundo), Google Fonts (Inter).
* **Versionamento:** Git & GitHub.

---

## 📐 Modelagem SQL & Banco de Dados
A inteligência do projeto reside na automação do banco de dados `CafeDB`.

### 🛡️ Segurança e Auditoria
O sistema utiliza **Triggers** para garantir que cada alteração no estoque ou inserção de produto seja registrada em uma tabela de auditoria (`LogsOperacoes`), permitindo rastreabilidade total.

```sql
-- Exemplo de Trigger de Auditoria implementada
CREATE TRIGGER trg_AuditProduto ON Produtos AFTER INSERT AS
BEGIN
    INSERT INTO LogsOperacoes (Descricao)
    SELECT 'Item "' + Nome + '" adicionado ao estoque via Dashboard.' FROM inserted;
END;
