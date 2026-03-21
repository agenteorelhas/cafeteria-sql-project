document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.content-view');

    // Navegação entre abas
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Ativa o link na sidebar
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Esconde todas as telas e mostra a alvo
            views.forEach(v => v.style.display = 'none');
            const target = 'view-' + this.getAttribute('href').replace('#', '');
            const targetView = document.getElementById(target);
            
            if (targetView) {
                targetView.style.display = 'block';
            }

            // Anima o gauge se estiver na tela de estoque
            if (target === 'view-estoque') {
                setTimeout(animarEstoque, 200);
            }
        });
    });

    // Função para simular preenchimento de estoque
    function animarEstoque() {
        const fill = document.getElementById('gauge-cafe-fill');
        const needle = document.getElementById('gauge-cafe-needle');
        const text = document.getElementById('gauge-cafe-text');
        
        if (fill && needle) {
            fill.style.transform = `rotate(0.375turn)`; // 75%
            needle.style.transform = `translateX(-50%) rotate(45deg)`;
            text.innerText = "75%";
        }
    }

    // Gerador de tabela de produtos (Mock)
    const lista = document.getElementById('lista-produtos');
    const dadosProdutos = [
        {id: "#101", nome: "Grãos Arábica (1kg)", preco: "R$ 85,00", status: "Em estoque"},
        {id: "#102", nome: "Leite Integral (Caixa)", preco: "R$ 5,40", status: "Crítico"},
        {id: "#103", nome: "Cápsula Espresso", preco: "R$ 2,50", status: "Em estoque"}
    ];

    if (lista) {
        lista.innerHTML = dadosProdutos.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>${p.preco}</td>
                <td><span style="color: ${p.status === 'Crítico' ? '#e74c3c' : '#2ecc71'}">${p.status}</span></td>
            </tr>
        `).join('');
    }
});
