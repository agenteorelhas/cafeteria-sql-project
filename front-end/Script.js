// Simulação de dados do Banco SQL
const db_produtos = [
    { id: 1, nome: "Espresso Tradicional", preco: 6.50, status: "Ativo" },
    { id: 2, nome: "Cappuccino Italiano", preco: 12.00, status: "Ativo" },
    { id: 3, nome: "Latte Macchiato", preco: 14.50, status: "Estoque Baixo" },
    { id: 4, nome: "Mocha Chocolate", preco: 16.00, status: "Inativo" }
];

const listaProdutos = document.getElementById('lista-produtos');
const inputBusca = document.getElementById('input-busca');

// Função para construir a tabela
function popularTabela(itens) {
    listaProdutos.innerHTML = itens.map(p => `
        <tr>
            <td>#${p.id}</td>
            <td><strong>${p.nome}</strong></td>
            <td>R$ ${p.preco.toFixed(2)}</td>
            <td><span style="color: ${p.status === 'Inativo' ? 'var(--danger)' : 'var(--success)'}">${p.status}</span></td>
            <td>
                <button class="btn-action edit" onclick="alert('Trigger log_precos simulado para ID ${p.id}')">Preço</button>
                <button class="btn-action delete" onclick="confirm('Soft Delete SQL para ID ${p.id}?')">Excluir</button>
            </td>
        </tr>
    `).join('');
}

// Filtro de busca em tempo real (Simula WHERE LIKE)
inputBusca.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = db_produtos.filter(p => 
        p.nome.toLowerCase().includes(termo) || p.id.toString().includes(termo)
    );
    popularTabela(filtrados);
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    popularTabela(db_produtos);
    console.log("Dashboard Cafeteria: Sistema Pronto.");
});
