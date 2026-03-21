// 1. Inicialização do Particles.js (Estilo Espresso Neon)
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 90, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": ["#6F4E37", "#D2B48C", "#3C2A21"] }, // Tons de Café e Areia
            "shape": { "type": "circle" },
            "opacity": { "value": 0.5, "random": true },
            "size": { "value": 3, "random": true },
            "line_linked": { 
                "enable": true, 
                "distance": 150, 
                "color": "#6F4E37", 
                "opacity": 0.3, 
                "width": 1 
            },
            "move": { "enable": true, "speed": 1.2, "direction": "none", "random": true }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": { "onhover": { "enable": true, "mode": "grab" }, "resize": true }
        },
        "retina_detect": true
    });
}

// 2. Navegação entre Abas e Lógica de Dados
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.content-view');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            views.forEach(v => v.style.display = 'none');
            const target = 'view-' + link.getAttribute('href').replace('#', '');
            document.getElementById(target).style.display = 'block';

            if (target === 'view-estoque') {
                setTimeout(animarGauge, 100);
            }
        });
    });

    // Mock de Dados da Tabela
    const tbody = document.getElementById('lista-produtos');
    const produtosMock = [
        { id: "#101", nome: "Café Gourmet Arábica", preco: "R$ 65,00", status: "Em estoque" },
        { id: "#102", nome: "Moedor Titan 2.0", preco: "R$ 450,00", status: "Crítico" },
        { id: "#103", nome: "Cápsula Intenso x10", preco: "R$ 22,50", status: "Em estoque" }
    ];

    if (tbody) {
        tbody.innerHTML = produtosMock.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>${p.preco}</td>
                <td><span style="color: ${p.status === 'Crítico' ? '#ff5555' : '#50fa7b'}">${p.status}</span></td>
            </tr>
        `).join('');
    }
});

// Animação do Medidor de Estoque
function animarGauge() {
    const fill = document.getElementById('gauge-cafe-fill');
    const needle = document.getElementById('gauge-cafe-needle');
    const text = document.getElementById('gauge-cafe-text');
    if (fill) {
        fill.style.transform = `rotate(0.375turn)`; // 75%
        needle.style.transform = `translateX(-50%) rotate(45deg)`;
        text.innerText = "75%";
    }
}
