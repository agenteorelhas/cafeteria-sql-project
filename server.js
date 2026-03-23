const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const config = {
    user: 'seu_user', password: 'sua_senha',
    server: 'localhost', database: 'CafeDB',
    options: { encrypt: true, trustServerCertificate: true }
};

app.post('/api/produtos', async (req, res) => {
    try {
        const { nome, preco, qtd } = req.body;
        let pool = await sql.connect(config);
        await pool.request()
            .input('n', sql.VarChar, nome)
            .input('p', sql.Decimal, preco)
            .input('q', sql.Int, qtd)
            .query('INSERT INTO Produtos (Nome, Preco, Quantidade) VALUES (@n, @p, @q)');
        res.sendStatus(201);
    } catch (err) { res.status(500).send(err.message); }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
