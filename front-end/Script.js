document.addEventListener('DOMContentLoaded', () => {
    // 1. Navegação de Abas
    const links = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.content-view');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove ativos
            links.forEach(l => l.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            // Adiciona ativo no clicado
            link.classList.add('active');
            const target = link.getAttribute('data-target');
            document.getElementById(target).classList.add('active');

            // Se for estoque, anima o gauge
            if(target === 'view-estoque') {
                setTimeout(animarGauge, 100);
            }
        });
    });

    // 2. Mock de Produtos
    const tbody = document.getElementById('lista-produtos');
    const produtos = [
        { id: "#101", nome: "Café Arábica", preco: "R$ 65,00", status: "Em estoque" },
        { id: "#102", nome: "Moedor Titan", preco: "R$ 450,00", status: "Crítico" }
    ];

    if(tbody) {
        tbody.innerHTML = produtos.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>${p.preco}</td>
                <td style="color: ${p.status === 'Crítico' ? '#ff5555' : '#50fa7b'}">${p.status}</td>
            </tr>
        `).join('');
    }

    // 3. Partículas
    if(window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 50 },
                "color": { "value": "#6F4E37" },
                "move": { "speed": 1.5 }
            }
        });
    }
});

function animarGauge() {
    const fill = document.getElementById('gauge-fill');
    const needle = document.getElementById('gauge-needle');
    const text = document.getElementById('gauge-text');
    
    if(fill && needle) {
        fill.style.transform = `rotate(0.42turn)`; // 84%
        needle.style.transform = `translateX(-50%) rotate(61deg)`;
        text.innerText = "84%";
    }
}
