const API = 'http://localhost:3000/api';

// NAV
document.querySelectorAll('.nav-link').forEach(link => {
    link.onclick = (e) => {
        e.preventDefault();
        document.querySelectorAll('.content-view').forEach(v => v.classList.remove('active'));
        document.getElementById(link.dataset.target).classList.add('active');
    };
});

// MODAL
document.getElementById('btn-novo-produto').onclick = () => {
    document.getElementById('modal').style.display = 'flex';
};

// PRODUTOS
async function carregarProdutos() {
    const res = await fetch(API + '/produtos');
    const data = await res.json();

    const tabela = document.getElementById('lista-produtos');
    tabela.innerHTML = '';

    data.forEach(p => {
        tabela.innerHTML += `
            <tr>
                <td>${p.ID}</td>
                <td>${p.Nome}</td>
                <td>${p.Preco}</td>
                <td>${p.Quantidade}</td>
            </tr>
        `;
    });
}

// SALVAR PRODUTO
async function salvarProduto() {
    const formData = new FormData();
    formData.append('nome', nome.value);
    formData.append('preco', preco.value);
    formData.append('quantidade', quantidade.value);
    formData.append('imagem', imagem.files[0]);

    await fetch(API + '/produtos', { method: 'POST', body: formData });

    location.reload();
}

// LOGS
async function carregarLogs() {
    const res = await fetch(API + '/logs');
    const data = await res.json();

    const el = document.getElementById('log-terminal');
    el.innerHTML = data.map(l => `<div>${l.Descricao}</div>`).join('');
}

// COMENTÁRIOS
async function enviarComentario() {
    await fetch(API + '/comentarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: document.getElementById('comentario-input').value })
    });
    carregarComentarios();
}

async function carregarComentarios() {
    const res = await fetch(API + '/comentarios');
    const data = await res.json();

    document.getElementById('lista-comentarios').innerHTML =
        data.map(c => `<div>${c.Texto}</div>`).join('');
}

// DASHBOARD
async function carregarDashboard() {
    const res = await fetch(API + '/dashboard');
    const d = await res.json();

    document.getElementById('dash-produtos').innerText = d.totalProdutos;
    document.getElementById('dash-estoque').innerText = d.totalEstoque;
}

// INIT
carregarProdutos();
carregarLogs();
carregarComentarios();
carregarDashboard();
