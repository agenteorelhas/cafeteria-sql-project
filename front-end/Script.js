const API = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

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
        location.reload();
    } else {
        alert('Login inválido');
    }
}

// AUTO LOGIN
if (token) {
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('.app').classList.remove('hidden');
}

// FETCH COM TOKEN
async function api(url, options = {}) {
    options.headers = {
        ...(options.headers || {}),
        Authorization: token
    };

    const res = await fetch(API + url, options);
    return res.json();
}

// PRODUTOS
async function carregarProdutos() {
    const data = await api('/produtos');

    lista-produtos.innerHTML = data.map(p =>
        `<tr><td>${p.ID}</td><td>${p.Nome}</td><td>${p.Preco}</td><td>${p.Quantidade}</td></tr>`
    ).join('');
}

// SALVAR
async function salvarProduto() {
    await api('/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome: nome.value,
            preco: preco.value,
            quantidade: quantidade.value
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

// INIT
if (token) {
    carregarProdutos();
    carregarDashboard();
}
