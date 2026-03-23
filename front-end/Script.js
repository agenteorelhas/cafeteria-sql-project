const API = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// INIT LOGIN BUTTON
document.getElementById('btn-login').onclick = login;

// LOGIN
async function login() {
    const email = document.getElementById('login-user').value;
    const senha = document.getElementById('login-pass').value;

    const res = await fetch(API + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (data.token) {
        token = data.token;
        localStorage.setItem('token', token);

        entrarApp();
    } else {
        alert('Login inválido');
    }
}

// REGISTER
async function register() {
    const email = document.getElementById('login-user').value;
    const senha = document.getElementById('login-pass').value;

    const res = await fetch(API + '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (data.ok) {
        alert('Conta criada! Faça login.');

        const btn = document.getElementById('btn-login');
        btn.innerText = 'Entrar';
        btn.onclick = login;

    } else {
        alert(data.erro || 'Erro ao criar conta');
    }
}

// TOGGLE
function toggleRegister() {
    const btn = document.getElementById('btn-login');

    if (btn.innerText === 'Entrar') {
        btn.innerText = 'Cadastrar';
        btn.onclick = register;
    } else {
        btn.innerText = 'Entrar';
        btn.onclick = login;
    }
}

// ENTRAR NO APP
function entrarApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('.app').classList.remove('hidden');

    init();
}

// AUTO LOGIN
if (token) entrarApp();

// API HELPER
async function api(url, options = {}) {
    options.headers = {
        ...(options.headers || {}),
        Authorization: token
    };

    const res = await fetch(API + url, options);
    return res.json();
}

// INIT
function init() {
    setupNav();
    carregarProdutos();
    carregarDashboard();
}

// NAVEGAÇÃO
function setupNav() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = () => {
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(link.dataset.target).classList.add('active');
        };
    });
}

// PRODUTOS
async function carregarProdutos() {
    const data = await api('/produtos');

    document.getElementById('lista-produtos').innerHTML = data.map(p => `
        <tr>
            <td>${p.ID}</td>
            <td>${p.Nome}</td>
            <td>R$ ${p.Preco}</td>
            <td>${p.Quantidade}</td>
        </tr>
    `).join('');
}

// DASHBOARD
async function carregarDashboard() {
    const d = await api('/dashboard');

    document.getElementById('dash-produtos').innerText = d.totalProdutos;
    document.getElementById('dash-estoque').innerText = d.totalEstoque;
}

// MODAL
function abrirModal() {
    document.getElementById('modal').style.display = 'flex';
}

// SALVAR PRODUTO
async function salvarProduto() {
    const nome = document.getElementById('p-nome').value;
    const preco = document.getElementById('p-preco').value;
    const quantidade = document.getElementById('p-qtd').value;

    await api('/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco, quantidade })
    });

    document.getElementById('modal').style.display = 'none';

    carregarProdutos();
    carregarDashboard();
}

// LOGOUT
function logout() {
    localStorage.removeItem('token');
    location.reload();
}
