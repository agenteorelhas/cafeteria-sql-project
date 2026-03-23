/* ==========================================================================
   --- LÓGICA DE NAVEGAÇÃO E GAUGE - CORRIGIDA E CONSOLIDADA ---
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Seletores para os links da sidebar e as views de conteúdo
    const links = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.content-view');

    // Função para gerenciar a troca de abas
    function trocarAba(targetId) {
        // 1. Esconde todas as views de conteúdo
        views.forEach(v => v.style.display = 'none');

        // 2. Mostra a view alvo
        const targetView = document.getElementById(targetId);
        if (targetView) {
            targetView.style.display = 'block';

            // 3. Se for a view de estoque, aciona a animação do Gauge
            if (targetId === 'view-estoque') {
                // Pequeno delay para garantir que o elemento esteja visível antes de animar
                setTimeout(animarGauge, 100);
            }
        }
    }

    // Adiciona evento de clique para cada link da sidebar
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o comportamento padrão do link

            // Remove a classe 'active' de todos os links e adiciona ao clicado
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Define qual view mostrar com base no ID do link
            let targetId;
            if (link.id === 'link-dashboard') targetId = 'view-dashboard';
            else if (link.id === 'link-produtos') targetId = 'view-produtos';
            else if (link.id === 'link-estoque') targetId = 'view-estoque';
            // Adicione outras abas aqui se necessário

            trocarAba(targetId);
        });
    });

    // Função de animação do Velocímetro (Gauge)
    function animarGauge() {
        const fill = document.getElementById('gauge-fill');
        const needle = document.getElementById('gauge-needle');
        const text = document.getElementById('gauge-text');
        
        if (fill && needle && text) {
            const valorPorcentagem = 84; // Valor alvo da animação

            // 1. Anima o preenchimento (Gira de 0turn a 0.5turn)
            const rotaçãoPreenchimento = (valorPorcentagem / 100) * 0.5;
            fill.style.transform = `rotate(${rotaçãoPreenchimento}turn)`;
            
            // 2. Anima a agulha (Gira de -90deg a +90deg)
            const rotaçãoAgulha = (valorPorcentagem / 100) * 180 - 90;
            needle.style.transform = `translateX(-50%) rotate(${rotaçãoAgulha}deg)`;
            
            // 3. Anima o texto (Contagem progressiva)
            text.innerText = valorPorcentagem + "%"; // Define o valor final diretamente
        }
    }
});
