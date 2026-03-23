const API = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// LOGIN
function login() {
    localStorage.setItem('token', 'fake');
    location.reload();
}

function logout() {
    localStorage.removeItem('token');
    location.reload();
}

if (token) {
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('.app').classList.remove('hidden');
}

// NAV
document.querySelectorAll('.nav-link').forEach(link => {
    link.onclick = () => {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        link.classList.add('active');
        document.getElementById(link.dataset.target).classList.add('active');
        page-title.innerText = link.innerText;
    };
});

// MODAL
function openModal() {
    modal.style.display = 'flex';
}

// MOCK DATA
function carregarProdutos() {
    lista-produtos.innerHTML = `
        <tr><td>1</td><td>Café Premium</td><td>25</td><td>10</td></tr>
    `;
}

carregarProdutos();
