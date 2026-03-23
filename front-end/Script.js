const API = 'http://localhost:3000/api';

// LOGIN
function login() {
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('.app').classList.remove('hidden');
}

function logout() {
    location.reload();
}

// NAV
document.querySelectorAll('.nav-link').forEach(link => {
    link.onclick = () => {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(link.dataset.target).classList.add('active');
    };
});

// MODAL
function openModal() {
    modal.style.display = 'flex';
}

// PRODUTOS
async function carregarProdutos() {
    const res = await fetch(API + '/produtos');
    const data = await res.json();

    lista-produtos.innerHTML = data.map(p =>
        `<tr><td>${p.ID}</td><td>${p.Nome}</td><td>${p.Preco}</td><td>${p.Quantidade}</td></tr>`
    ).join('');
}

// DASHBOARD + CHART
async function carregarDashboard() {
    const res = await fetch(API + '/dashboard');
    const d = await res.json();

    dash-produtos.innerText = d.totalProdutos;
    dash-estoque.innerText = d.totalEstoque;

    new Chart(document.getElementById('chart'), {
        type: 'bar',
        data: {
            labels: ['Produtos', 'Estoque'],
            datasets: [{
                data: [d.totalProdutos, d.totalEstoque]
            }]
        }
    });
}

// INIT
carregarProdutos();
carregarDashboard();
