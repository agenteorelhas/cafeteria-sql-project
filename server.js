const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 CONFIG
const SECRET = 'cafesaas_secret';

// 🗄️ CONFIG DO BANCO
const dbConfig = {
    user: 'cafe_user',
    password: '123456',
    server: 'localhost\\SQLEXPRESS',
    database: 'CafeSaaS',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// 🔌 CONEXÃO GLOBAL
let pool;
sql.connect(dbConfig)
    .then(p => {
        pool = p;
        console.log('🔥 Conectado ao SQL Server');
    })
    .catch(err => console.log('❌ Erro SQL:', err));

// 🔐 MIDDLEWARE AUTH
function auth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ erro: 'Sem token' });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ erro: 'Token inválido' });
    }
}

// =========================
// 👤 AUTH
// =========================

// REGISTRAR
app.post('/api/register', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const hash = await bcrypt.hash(senha, 10);

        await pool.request()
            .input('email', sql.VarChar, email)
            .input('senha', sql.VarChar, hash)
            .query(`
                INSERT INTO Usuarios (Email, SenhaHash)
                VALUES (@email, @senha)
            `);

        res.json({ ok: true });
    } catch (err) {
        res.status(400).json({ erro: 'Usuário já existe ou erro' });
    }
});

// LOGIN
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query(`SELECT * FROM Usuarios WHERE Email = @email`);

        const user = result.recordset[0];

        if (!user) return res.json({ erro: 'Usuário não encontrado' });

        const match = await bcrypt.compare(senha, user.SenhaHash);

        if (!match) return res.json({ erro: 'Senha inválida' });

        const token = jwt.sign(
            { id: user.ID, email: user.Email },
            SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token });

    } catch (err) {
        res.status(500).json({ erro: 'Erro no login' });
    }
});

// =========================
// 📦 PRODUTOS
// =========================

// LISTAR
app.get('/api/produtos', auth, async (req, res) => {
    const userId = req.user.id;

    const result = await pool.request()
        .input('uid', sql.Int, userId)
        .query(`
            SELECT * FROM Produtos
            WHERE UsuarioID = @uid
            ORDER BY ID DESC
        `);

    res.json(result.recordset);
});

// CRIAR
app.post('/api/produtos', auth, async (req, res) => {
    const { nome, preco, quantidade } = req.body;
    const userId = req.user.id;

    await pool.request()
        .input('nome', sql.VarChar, nome)
        .input('preco', sql.Decimal(10,2), preco)
        .input('qtd', sql.Int, quantidade)
        .input('uid', sql.Int, userId)
        .query(`
            INSERT INTO Produtos (Nome, Preco, Quantidade, UsuarioID)
            VALUES (@nome, @preco, @qtd, @uid)
        `);

    res.json({ ok: true });
});

// =========================
// 📊 DASHBOARD
// =========================

app.get('/api/dashboard', auth, async (req, res) => {
    const userId = req.user.id;

    const result = await pool.request()
        .input('uid', sql.Int, userId)
        .query(`
            SELECT 
                COUNT(*) as totalProdutos,
                ISNULL(SUM(Quantidade),0) as totalEstoque
            FROM Produtos
            WHERE UsuarioID = @uid
        `);

    res.json(result.recordset[0]);
});

// =========================
// 🚀 START
// =========================

app.listen(3000, () => {
    console.log('🔥 SaaS rodando na porta 3000');
});
