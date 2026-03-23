const API = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// BOTÃO LOGIN
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
        localStorage.setItem('token', data.token);

        document.getElementById('login-screen').style.display = 'none';
        document.querySelector('.app').classList.remove('hidden');

        init();
    } else {
        alert('Login inválido');
    }
}

// REGISTRO (CORRIGIDO)
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
        alert('Conta criada com sucesso! Agora faça login.');

        // VOLTA PRO LOGIN
        const btn = document.getElementById('btn-login');
        btn.innerText = 'Entrar';
        btn.onclick = login;

    } else {
        alert(data.erro || 'Erro ao criar conta');
    }
}

// TOGGLE ENTRE LOGIN E CADASTRO
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

// AUTO LOGIN
if (token) {
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('.app').classList.remove('hidden');
    init();
}

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
    carregarProdutos();
    carregarDashboard();
}

// PRODUTOS
async function carregarProdutos() {
    const data = await api('/produtos');

    lista-produtos.innerHTML = data.map(p =>
        `<tr>
            <td>${p.ID}</td>
            <td>${p.Nome}</td>
            <td>${p.Preco}</td>
            <td>${p.Quantidade}</td>
        </tr>`
    ).join('');
}

// SALVAR PRODUTO
async function salvarProduto() {
    await api('/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome: "Novo Café",
            preco: 20,
            quantidade: 5
        })
    });

    carregarProdutos();
}

// DASHBOARD
async function carregarDashboard() {
    const d = await api('/dashboard');

    dash-produtos.innerText = d.totalProdutos;
    dash-estoque.innerText = d.totalEstoque;
}

// LOGOUT
function logout() {
    localStorage.removeItem('token');
    location.reload();
}
