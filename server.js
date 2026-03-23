const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIG DO BANCO
const dbConfig = {
    user: 'seu_usuario',
    password: 'sua_senha',
    server: 'localhost',
    database: 'CafeDB',
    options: {
        encrypt: false, // localhost não precisa
        trustServerCertificate: true
    }
};

// CONEXÃO GLOBAL (evita reconectar toda hora)
let pool;

async function conectarDB() {
    try {
        pool = await sql.connect(dbConfig);
        console.log('Conectado ao SQL Server');
    } catch (err) {
        console.error('Erro ao conectar no banco:', err);
    }
}

conectarDB();

// =======================
// ROTAS
// =======================

// LOGS
app.get('/api/logs', async (req, res) => {
    try {
        const result = await pool.request()
            .query('SELECT TOP 10 Descricao, DataHora FROM LogsOperacoes ORDER BY DataHora DESC');

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// PRODUTOS
app.get('/api/produtos', async (req, res) => {
    try {
        const result = await pool.request()
            .query('SELECT * FROM Produtos ORDER BY ID DESC');

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// INSERIR PRODUTO (ativa a trigger automaticamente)
app.post('/api/produtos', async (req, res) => {
    const { nome, preco, quantidade } = req.body;

    if (!nome || !preco || !quantidade) {
        return res.status(400).json({ erro: 'Dados inválidos' });
    }

    try {
        await pool.request()
            .input('nome', sql.VarChar, nome)
            .input('preco', sql.Decimal(10, 2), preco)
            .input('quantidade', sql.Int, quantidade)
            .query(`
                INSERT INTO Produtos (Nome, Preco, Quantidade)
                VALUES (@nome, @preco, @quantidade)
            `);

        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// START
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
