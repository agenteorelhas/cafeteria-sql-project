const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Upload config
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// DB
const dbConfig = {
    user: 'seu_usuario',
    password: 'sua_senha',
    server: 'localhost',
    database: 'CafeDB',
    options: { encrypt: false, trustServerCertificate: true }
};

let pool;
async function conectarDB() {
    pool = await sql.connect(dbConfig);
}
conectarDB();

// ================= ROTAS =================

// PRODUTOS
app.get('/api/produtos', async (req, res) => {
    const result = await pool.request().query('SELECT * FROM Produtos ORDER BY ID DESC');
    res.json(result.recordset);
});

app.post('/api/produtos', upload.single('imagem'), async (req, res) => {
    const { nome, preco, quantidade } = req.body;
    const imagem = req.file ? req.file.filename : null;

    await pool.request()
        .input('nome', sql.VarChar, nome)
        .input('preco', sql.Decimal(10,2), preco)
        .input('quantidade', sql.Int, quantidade)
        .input('imagem', sql.VarChar, imagem)
        .query(`
            INSERT INTO Produtos (Nome, Preco, Quantidade, Imagem)
            VALUES (@nome, @preco, @quantidade, @imagem)
        `);

    res.json({ sucesso: true });
});

// LOGS
app.get('/api/logs', async (req, res) => {
    const result = await pool.request()
        .query('SELECT TOP 10 * FROM LogsOperacoes ORDER BY DataHora DESC');
    res.json(result.recordset);
});

// COMENTÁRIOS
app.get('/api/comentarios', async (req, res) => {
    const result = await pool.request().query('SELECT * FROM Comentarios');
    res.json(result.recordset);
});

app.post('/api/comentarios', async (req, res) => {
    const { texto } = req.body;

    await pool.request()
        .input('texto', sql.VarChar, texto)
        .query('INSERT INTO Comentarios (Texto) VALUES (@texto)');

    res.json({ sucesso: true });
});

// DASHBOARD
app.get('/api/dashboard', async (req, res) => {
    const result = await pool.request().query(`
        SELECT 
            (SELECT COUNT(*) FROM Produtos) AS totalProdutos,
            (SELECT SUM(Quantidade) FROM Produtos) AS totalEstoque
    `);

    res.json(result.recordset[0]);
});

app.listen(3000, () => console.log('Servidor rodando'));
