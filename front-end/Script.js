document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.content-view');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 1. Alternar classe ativa
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // 2. Alternar visualização das telas
            const targetId = 'view-' + this.getAttribute('href').replace('#', '');
            views.forEach(v => {
                v.style.display = (v.id === targetId) ? 'block' : 'none';
            });

            // 3. Carregar animação de estoque se necessário
            if (targetId === 'view-estoque') {
                setTimeout(() => animarGauge('gauge-cafe', 0.75), 100);
            }
        });
    });

    function animarGauge(id, val) {
        const fill = document.getElementById(`${id}-fill`);
        const needle = document.getElementById(`${id}-needle`);
        const text = document.getElementById(`${id}-text`);
        if (fill && needle) {
            fill.style.transform = `rotate(${val / 2}turn)`;
            needle.style.transform = `translateX(-50%) rotate(${(val * 180) - 90}deg)`;
            text.innerText = `${Math.round(val * 100)}%`;
        }
    }
});
