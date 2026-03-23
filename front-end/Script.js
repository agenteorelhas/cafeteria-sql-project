const API = 'http://localhost:3000/api';

// NAV
document.querySelectorAll('.nav-link').forEach(link => {
    link.onclick = () => {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

        link.classList.add('active');
        document.getElementById(link.dataset.target).classList.add('active');
        document.getElementById('page-title').innerText = link.innerText;
    };
});

// MODAL
btn-novo-produto.onclick = () => modal.style.display = 'flex';

// INIT
async function init() {
    carregarProdutos();
    carregarLogs();
    carregarDashboard();
    carregarComentarios();
}

init();
