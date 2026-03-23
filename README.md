# ☕ Espresso SQL Admin & Cafeteria SaaS

Projeto completo de **modelagem, análise e gestão de dados de uma cafeteria**, evoluído para uma **plataforma SaaS Full-Stack com autenticação, API REST e dashboard moderno**.

---

![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens)
![SaaS](https://img.shields.io/badge/SaaS-Platform-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Produção_ready-brightgreen?style=for-the-badge)

---

## 🚀 Visão Geral

Este projeto começou como um banco de dados relacional robusto e evoluiu para uma **aplicação SaaS completa**, incluindo:

- 🔐 Autenticação com JWT
- 🌐 API REST com Node.js
- 💻 Dashboard administrativo moderno
- 📊 Visualização de dados em tempo real
- ☁️ Pronto para deploy

---

## 🧭 Navegação Rápida

- 📊 [Casos de Uso](documents/USE_CASES.md)
- 📝 [Dicionário de Dados](documents/DATA_DICTIONARY.md)
- 💻 [Scripts SQL](./scripts/)
- 🌐 Interface Web (`index.html`)

---

## 📌 Sobre o Projeto

A aplicação simula um sistema completo de gestão de cafeteria, permitindo:

- Controle de produtos
- Gestão de estoque
- Registro de vendas
- Auditoria automática
- Dashboard em tempo real

Na versão atual, funciona como um **mini SaaS multi-usuário**, onde cada usuário possui seus próprios dados isolados.

---

## 🎨 Interface (Frontend SaaS)

Interface moderna inspirada em produtos como Stripe e Notion.

### ✨ Características

- Dark Mode profissional
- Sidebar interativa
- Layout responsivo (base)
- UI limpa e escalável

### 📌 Componentes

- Dashboard com métricas
- Tabela de produtos
- Modal de criação
- Sistema de login/cadastro

---

## 🔐 Autenticação e Segurança

- Login com JWT
- Senhas criptografadas com bcrypt
- Rotas protegidas
- Persistência de sessão (localStorage)

### 🔄 Fluxo de autenticação

1. Usuário cria conta
2. Senha é criptografada
3. Login gera token JWT
4. Token é usado nas requisições

---

## ⚙️ Backend (API REST)

### Tecnologias

- Node.js
- Express
- MSSQL

### 📡 Endpoints

| Método | Rota | Descrição |
|------|------|--------|
| POST | /api/register | Criar usuário |
| POST | /api/login | Autenticação |
| GET | /api/produtos | Listar produtos |
| POST | /api/produtos | Criar produto |
| GET | /api/dashboard | Métricas |

---

## 🗄️ Banco de Dados

### 📌 Estrutura principal

- `Usuarios` → autenticação
- `Produtos` → itens
- `LogsOperacoes` → auditoria

### ⚡ Recursos avançados

- Triggers automáticas
- Stored Procedures
- Views analíticas
- Índices para performance
- Soft delete

---

## 🔄 Fluxo de Dados

1. Frontend envia requisição
2. API valida token
3. Banco executa operação
4. Trigger registra log
5. Dashboard atualiza

---

## 📊 Business Intelligence (BI)

- Views analíticas
- Queries complexas (JOIN, GROUP BY)
- Base para integração com Power BI

---

## 🧠 Arquitetura
