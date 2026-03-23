document.addEventListener('DOMContentLoaded', () => {
    // 1. Partículas Sutis (Tamanho 3 como pedido)
    if (window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#6F4E37" },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#6F4E37", "opacity": 0.2 },
                "move": { "speed": 1 }
            }
        });
    }

    // 2. Navegação de Abas
    const links = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.content-view');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            link.classList.add('active');
            const target = link.getAttribute('data-target');
            document.getElementById(target).classList.add('active');

            if (target === 'view-estoque') {
                setTimeout(animarGauge, 100);
            }
        });
    });
});

function animarGauge() {
    const fill = document.getElementById('gauge-fill');
    const needle = document.getElementById('gauge-needle');
    const text = document.getElementById('gauge-text');
    
    if (fill && needle) {
        const percent = 84; 
        fill.style.transform = `rotate(${(percent / 100) * 0.5}turn)`;
        needle.style.transform = `translateX(-50%) rotate(${(percent / 100) * 180 - 90}deg)`;
        
        let count = 0;
        let timer = setInterval(() => {
            if (count >= percent) {
                text.innerText = percent + "%";
                clearInterval(timer);
            } else {
                text.innerText = count + "%";
                count++;
            }
        }, 15);
    }
}
