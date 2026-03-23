const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "segredo_super_saas";

// DB
const dbConfig = {
    user: 'seu_usuario',
    password: 'sua_senha',
    server: 'localhost',
    database: 'CafeSaaS',
    options: { encrypt: false, trustServerCertificate: true }
};

let pool;
sql.connect(dbConfig).then(p => pool = p);

// 🔐 MIDDLEWARE
function auth(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch {
        res.sendStatus(403);
    }
}

// LOGIN
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    const result = await pool.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM Usuarios WHERE Email=@email');

    const user = result.recordset[0];

    if (!user || user.SenhaHash !== senha)
        return res.status(401).json({ erro: 'Login inválido' });

    const token = jwt.sign({ id: user.ID }, SECRET);

    res.json({ token });
});

// PRODUTOS PROTEGIDOS
app.get('/api/produtos', auth, async (req, res) => {
    const result = await pool.request()
        .input('uid', sql.Int, req.user.id)
        .query('SELECT * FROM Produtos WHERE UsuarioID=@uid');

    res.json(result.recordset);
});

app.post('/api/produtos', auth, async (req, res) => {
    const { nome, preco, quantidade } = req.body;

    await pool.request()
        .input('nome', sql.VarChar, nome)
        .input('preco', sql.Decimal(10,2), preco)
        .input('quantidade', sql.Int, quantidade)
        .input('uid', sql.Int, req.user.id)
        .query(`
            INSERT INTO Produtos (Nome, Preco, Quantidade, UsuarioID)
            VALUES (@nome, @preco, @quantidade, @uid)
        `);

    res.json({ ok: true });
});

// DASHBOARD
app.get('/api/dashboard', auth, async (req, res) => {
    const result = await pool.request()
        .input('uid', sql.Int, req.user.id)
        .query(`
            SELECT 
                COUNT(*) as totalProdutos,
                SUM(Quantidade) as totalEstoque
            FROM Produtos
            WHERE UsuarioID=@uid
        `);

    res.json(result.recordset[0]);
});

app.listen(3000, () => console.log('SaaS rodando 🚀'));

const bcrypt = require('bcrypt');

// REGISTRO
app.post('/api/register', async (req, res) => {
    const { email, senha } = req.body;

    const hash = await bcrypt.hash(senha, 10);

    try {
        await pool.request()
            .input('email', sql.VarChar, email)
            .input('senha', sql.VarChar, hash)
            .query(`
                INSERT INTO Usuarios (Email, SenhaHash)
                VALUES (@email, @senha)
            `);

        res.json({ ok: true });

    } catch (err) {
        res.status(400).json({ erro: 'Usuário já existe' });
    }
});
