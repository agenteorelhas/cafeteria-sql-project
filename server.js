const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configure seus dados aqui
const dbConfig = {
    user: 'seu_usuario', 
    password: 'sua_senha',
    server: 'localhost', 
    database: 'CafeDB',
    options: { encrypt: true, trustServerCertificate: true }
};

app.get('/api/logs', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT TOP 10 Descricao, DataHora FROM LogsOperacoes ORDER BY DataHora DESC');
        res.json(result.recordset);
    } catch (err) { res.status(500).send(err.message); }
});

app.listen(3000, () => console.log("Servidor ativo na porta 3000"));
