document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.content-view');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active de todos
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Esconde todas as views
            views.forEach(v => v.style.display = 'none');

            // Mostra a view alvo
            const target = 'view-' + this.getAttribute('href').replace('#', '');
            document.getElementById(target).style.display = 'block';

            // Se for estoque, anima o gauge
            if (target === 'view-estoque') {
                setTimeout(() => {
                    const fill = document.getElementById('gauge-cafe-fill');
                    const needle = document.getElementById('gauge-cafe-needle');
                    const text = document.getElementById('gauge-cafe-text');
                    if(fill) {
                        fill.style.transform = `rotate(0.375turn)`; // 75%
                        needle.style.transform = `translateX(-50%) rotate(45deg)`;
                        text.innerText = "75%";
                    }
                }, 100);
            }
        });
    });

    // Mock de produtos
    const lista = document.getElementById('lista-produtos');
    const dados = [
        {id: "#1", nome: "Espresso", preco: "R$ 6,50", status: "Ativo"},
        {id: "#2", nome: "Cappuccino", preco: "R$ 12,00", status: "Ativo"}
    ];

    if(lista) {
        lista.innerHTML = dados.map(p => `
            <tr><td>${p.id}</td><td>${p.nome}</td><td>${p.preco}</td><td>${p.status}</td></tr>
        `).join('');
    }
});
