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
        
        // Remove active de todos e adiciona no clicado
        links.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Troca as views
        const targetId = this.getAttribute('href').replace('#', 'view-');
        views.forEach(v => {
            v.style.display = (v.id === targetId) ? 'block' : 'none';
        });

        // Dispara funções específicas de cada aba
        if (targetId === 'view-estoque') carregarEstoque();
    });
});

// 2. Tabela & Busca
function renderTabela(itens) {
    const lista = document.getElementById('lista-produtos');
    if (!lista) return; // Segurança caso o elemento não exista

    lista.innerHTML = itens.map(p => `
        <tr>
            <td>#${p.id}</td>
            <td>${p.nome}</td>
            <td>R$ ${p.preco.toFixed(2)}</td>
            <td>${p.status}</td>
            <td><button class="btn-action edit" onclick="alert('Update simulado')">Preço</button></td>
        </tr>
    `).join('');
}

// Busca Dinâmica com verificação de existência
const inputBusca = document.getElementById('input-busca');
if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const filtrados = db_produtos.filter(p => 
            p.nome.toLowerCase().includes(termo) || p.id.toString().includes(termo)
        );
        renderTabela(filtrados);
    });
}

// 3. Gráficos Gauge
function setGauge(id, val) {
    const fill = document.getElementById(`${id}-fill`);
    const needle = document.getElementById(`${id}-needle`);
    const text = document.getElementById(`${id}-text`);
    const cardId = `card-${id.split('-')[1]}`;
    const card = document.getElementById(cardId);

    if (!fill || !needle || !text) return; // Evita erros se os elementos não existirem

    // Aplica transformações
    fill.style.transform = `rotate(${val / 2}turn)`;
    needle.style.transform = `translateX(-50%) rotate(${(val * 180) - 90}deg)`;
    text.innerText = `${Math.round(val * 100)}%`;
    
    // Alerta crítico
    if (card) {
