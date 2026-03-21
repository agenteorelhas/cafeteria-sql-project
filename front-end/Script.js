// Configuração Partículas Marrons
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": ["#6F4E37", "#D2B48C", "#3C2A21"] },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.4 },
            "size": { "value": 3 },
            "line_linked": { "enable": true, "distance": 150, "color": "#6F4E37", "opacity": 0.3, "width": 1 },
            "move": { "enable": true, "speed": 1.5 }
        },
        "interactivity": { "events": { "onhover": { "enable": true, "mode": "grab" } } },
        "retina_detect": true
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.content-view');

    // Navegação
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            views.forEach(v => v.style.display = 'none');
            const target = 'view-' + link.getAttribute('href').replace('#', '');
            document.getElementById(target).style.display = 'block';

            if (target === 'view-estoque') {
                setTimeout(animarGauge, 300);
            }
        });
    });

    // Função Velocímetro
    function animarGauge() {
        const fill = document.getElementById('gauge-cafe-fill');
        const needle = document.getElementById('gauge-cafe-needle');
        const text = document.getElementById('gauge-cafe-text');
        
        if (!fill || !needle) return;

        const porcentagem = 84; 
        const fillRotation = (porcentagem / 100) * 0.5; // Em turn
        const needleRotation = (porcentagem / 100) * 180 - 90; // Em graus

        fill.style.transform = `rotate(${fillRotation}turn)`;
        needle.style.transform = `translateX(-50%) rotate(${needleRotation}deg)`;

        // Contador numérico
        let current = 0;
        const interval = setInterval(() => {
            if (current >= porcentagem) clearInterval(interval);
            else { current++; text.innerText = current + "%"; }
        }, 20);
    }
});
