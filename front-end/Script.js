// Inicialização do Particles.js
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": ["#bd93f9", "#ff79c6"] }, // Cores Dracula
            "shape": { "type": "circle" },
            "opacity": { "value": 0.4 },
            "size": { "value": 3 },
            "line_linked": { 
                "enable": true, 
                "distance": 150, 
                "color": "#6272a4", 
                "opacity": 0.3, 
                "width": 1 
            },
            "move": { "enable": true, "speed": 1.5 }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": { "onhover": { "enable": true, "mode": "grab" }, "resize": true }
        },
        "retina_detect": true
    });
}

// Navegação entre Abas
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

    // Mock de Dados
    const tbody = document.getElementById('lista-produtos');
    const produtos = [
        { id: "#1", nome: "Espresso", preco: "R$ 6,50", status: "Ativo" },
        { id: "#2", nome: "Cappuccino", preco: "R$ 12,00", status: "Ativo" }
    ];

    if (tbody) {
        tbody.innerHTML = produtos.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>${p.preco}</td>
                <td><span style="color: #50fa7b">${p.status}</span></td>
            </tr>
        `).join('');
    }
});

function animarGauge() {
    const fill = document.getElementById('gauge-cafe-fill');
    const needle = document.getElementById('gauge-cafe-needle');
    const text = document.getElementById('gauge-cafe-text');
    
    if (fill) {
        fill.style.transform = `rotate(0.375turn)`;
        needle.style.transform = `translateX(-50%) rotate(45deg)`;
        text.innerText = "75%";
    }
}
