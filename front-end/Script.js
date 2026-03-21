document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.content-view');

    // 1. Navegação de Abas
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Troca classes ativas
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Esconde todas e mostra a selecionada
            const targetId = 'view-' + this.getAttribute('href').replace('#', '');
            views.forEach(v => {
                v.style.display = (v.id === targetId) ? 'block' : 'none';
            });

            // Dispara animação se for a aba de estoque
            if (targetId === 'view-estoque') carregarEstoque();
        });
    });

    // 2. Mock de Dados e Tabela
    const db_produtos = [
        { id: 1, nome: "Espresso", preco: 6.50, status: "Ativo" },
        { id: 2, nome: "Cappuccino", preco: 12.00, status: "Ativo" },
        { id: 3, nome: "Macchiato", preco: 14.00, status: "Alerta" }
    ];

    function renderTabela(itens) {
        const lista = document.getElementById('lista-produtos');
        if (!lista) return;
        lista.innerHTML = itens.map(p => `
            <tr>
                <td>#${p.id}</td>
                <td>${p.nome}</td>
                <td>R$ ${p.preco.toFixed(2)}</td>
                <td>${p.status}</td>
                <td><button onclick="alert('Editar ID #${p.id}')">Editar</button></td>
            </tr>
        `).join('');
    }

    // 3. Sistema de Gauges
    function setGaugeValue(id, value) {
        const fill = document.getElementById(`${id}-fill`);
        const needle = document.getElementById(`${id}-needle`);
        const text = document.getElementById(`${id}-text`);
        const card = document.getElementById(`card-${id.split('-')[1]}`);

        if (!fill || !needle) return;

        fill.style.transform = `rotate(${value / 2}turn)`;
        needle.style.transform = `translateX(-50%) rotate(${(value * 180) - 90}deg)`;
        text.innerText = `${Math.round(value * 100)}%`;

        if (value <= 0.20) card.classList.add('critical-alert');
        else card.classList.remove('critical-alert');
    }

    function carregarEstoque() {
        setTimeout(() => {
            setGaugeValue("gauge-cafe", 0.85);
            setGaugeValue("gauge-leite", 0.15);
        }, 300);
    }

    renderTabela(db_produtos);
});
