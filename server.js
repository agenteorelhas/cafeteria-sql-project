const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = 'cafesaas_secret';

// 🗄️ BANCO SQLITE (CRIA AUTOMÁTICO)
const db = new sqlite3.Database('./database.sqlite');

// 📦 CRIAR TABELAS AUTOMATICAMENTE
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Usuarios (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Email TEXT UNIQUE,
            SenhaHash TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Produtos (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Nome TEXT,
            Preco REAL,
            Quantidade INTEGER,
            UsuarioID INTEGER
        )
    `);
});

// 🔐 MIDDLEWARE
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

// ================== AUTH ==================

// REGISTER
app.post('/api/register', async (req, res) => {
    const { email, senha } = req.body;

    const hash = await bcrypt.hash(senha, 10);

    db.run(
        `INSERT INTO Usuarios (Email, SenhaHash) VALUES (?, ?)`,
        [email, hash],
        function (err) {
            if (err) return res.status(400).json({ erro: 'Usuário já existe' });
            res.json({ ok: true });
        }
    );
});

// LOGIN
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;

    db.get(
        `SELECT * FROM Usuarios WHERE Email = ?`,
        [email],
        async (err, user) => {
            if (!user) return res.json({ erro: 'Usuário não encontrado' });

            const match = await bcrypt.compare(senha, user.SenhaHash);

            if (!match) return res.json({ erro: 'Senha inválida' });

            const token = jwt.sign(
                { id: user.ID, email: user.Email },
                SECRET,
                { expiresIn: '8h' }
            );

            res.json({ token });
        }
    );
});

// ================== PRODUTOS ==================

// LISTAR
app.get('/api/produtos', auth, (req, res) => {
    db.all(
        `SELECT * FROM Produtos WHERE UsuarioID = ? ORDER BY ID DESC`,
        [req.user.id],
        (err, rows) => {
            res.json(rows);
        }
    );
});

// CRIAR
app.post('/api/produtos', auth, (req, res) => {
    const { nome, preco, quantidade } = req.body;

    db.run(
        `INSERT INTO Produtos (Nome, Preco, Quantidade, UsuarioID)
         VALUES (?, ?, ?, ?)`,
        [nome, preco, quantidade, req.user.id],
        () => res.json({ ok: true })
    );
});

// ================== DASHBOARD ==================

app.get('/api/dashboard', auth, (req, res) => {
    db.get(
        `SELECT 
            COUNT(*) as totalProdutos,
            IFNULL(SUM(Quantidade),0) as totalEstoque
         FROM Produtos WHERE UsuarioID = ?`,
        [req.user.id],
        (err, row) => {
            res.json(row);
        }
    );
});

// 🚀 START
app.listen(3000, () => {
    console.log('🔥 SaaS com SQLite rodando na porta 3000');
});
