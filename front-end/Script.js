// Dados Mockados
const db_produtos = [
    { id: 1, nome: "Espresso", preco: 6.50, status: "Ativo" },
    { id: 2, nome: "Cappuccino", preco: 12.00, status: "Ativo" },
    { id: 3, nome: "Macchiato", preco: 14.00, status: "Alerta" }
];

// 1. Navegação de Abas
const links = document.querySelectorAll('.sidebar a');
const views = document.querySelectorAll('.content-view');

links.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        links.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        const target = this.getAttribute('href').replace('#', 'view-');
        views.forEach(v => v.style.display = v.id === target ? 'block' : 'none');

        if (target === 'view-estoque') carregarEstoque();
    });
});

// 2. Tabela & Busca
function renderTabela(itens) {
    const lista = document.getElementById('lista-produtos');
    lista.innerHTML = itens.map(p => `
        <tr><td>#${p.id}</td><td>${p.nome}</td><td>R$ ${p.preco.toFixed(2)}</td><td>${p.status}</td>
        <td><button class="btn-action edit" onclick="alert('Update simulado')">Preço</button></td></tr>
    `).join('');
}

document.getElementById('input-busca').addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    renderTabela(db_produtos.filter(p => p.nome.toLowerCase().includes(termo)));
});

// 3. Gráficos Gauge
function setGauge(id, val) {
    const fill = document.getElementById(`${id}-fill`);
    const needle = document.getElementById(`${id}-needle`);
    const text = document.getElementById(`${id}-text`);
    const card = document.getElementById(`card-${id.split('-')[1]}`);

    fill.style.transform = `rotate(${val / 2}turn)`;
    needle.style.transform = `translateX(-50%) rotate(${(val * 180) - 90}deg)`;
    text.innerText = `${Math.round(val * 100)}%`;
    
    val <= 0.2 ? card.classList.add('critical-alert') : card.classList.remove('critical-alert');
}

function carregarEstoque() {
    setTimeout(() => { setGauge("gauge-cafe", 0.85); setGauge("gauge-leite", 0.15); }, 300);
}

// 4. Exportar PDF
document.getElementById('btn-export-pdf').addEventListener('click', function() {
    this.classList.add('loading');
    setTimeout(() => { this.classList.remove('loading'); alert("PDF Gerado!"); }, 2000);
});

document.addEventListener('DOMContentLoaded', () => renderTabela(db_produtos));
