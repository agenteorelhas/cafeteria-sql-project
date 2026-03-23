const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();

app.use(cors()); app.use(express.json());

const dbConfig = {
    user: 'seu_user', password: 'sua_senha',
    server: 'localhost', database: 'CafeDB',
    options: { encrypt: true, trustServerCertificate: true }
};

app.post('/api/produtos', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        const { nome, preco, qtd } = req.body;
        await pool.request()
            .input('n', sql.VarChar, nome).input('p', sql.Decimal, preco).input('q', sql.Int, qtd)
            .query('INSERT INTO Produtos (Nome, Preco, Quantidade) VALUES (@n, @p, @q)');
        res.sendStatus(201);
    } catch (err) { res.status(500).send(err.message); }
});

app.get('/api/logs', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT TOP 10 Descricao, DataHora FROM LogsOperacoes ORDER BY DataHora DESC');
        res.json(result.recordset);
    } catch (err) { res.status(500).send(err.message); }
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
