// Configuração das Partículas na cor Marrom/Café
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
            "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
            "modes": { "bubble": { "distance": 200, "size": 6, "duration": 2, "opacity": 0.8 } }
        },
        "retina_detect": true
    });
}

// Navegação e Lógica
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
                setTimeout(animarGauge, 150);
            }
        });
    });

    // Mock de Dados
    const tbody = document.getElementById('lista-produtos');
    const dados = [
        { id: "#001", nome: "Café Bourbon Amarelo", preco: "R$ 78,00", status: "Estoque OK" },
        { id: "#002", nome: "Moedor Titan 2.0", preco: "R$ 450,00", status: "Atenção" }
    ];

    if (tbody) {
        tbody.innerHTML = dados.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>${p.preco}</td>
                <td><span style="color: ${p.status === 'Atenção' ? '#e74c3c' : '#d2b48c'}">${p.status}</span></td>
            </tr>
        `).join('');
    }
});

function animarGauge() {
    const fill = document.getElementById('gauge-cafe-fill');
    const needle = document.getElementById('gauge-cafe-needle');
    const text = document.getElementById('gauge-cafe-text');
    if (fill) {
        fill.style.transform = `rotate(0.42turn)`; // 84% de café
        needle.style.transform = `translateX(-50%) rotate(60deg)`;
        text.innerText = "84%";
    }
}
