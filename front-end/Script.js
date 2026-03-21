// Dados simulados (Mock) que viriam das tuas tabelas SQL
const produtosIniciais = [
    { id: 1, nome: 'Espresso Tradicional', preco: 5.50, ativo: true },
    { id: 2, nome: 'Cappuccino Italiano', preco: 12.00, ativo: true },
    { id: 3, nome: 'Latte Art Macchiato', preco: 15.90, ativo: false }
];

const tabela = document.getElementById('lista-produtos');

// Função para renderizar a tabela
function renderizarTabela(dados) {
    tabela.innerHTML = dados.map(p => `
        <tr>
            <td>#${p.id}</td>
            <td>${p.nome}</td>
            <td>R$ ${p.preco.toFixed(2)}</td>
            <td>
                <span class="status ${p.ativo ? 'online' : 'offline'}">
                    ${p.ativo ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn-action edit" onclick="editarPreco(${p.id})">Preço</button>
                <button class="btn-action delete" onclick="excluirProduto(${p.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

// Lógica dos Botões
function editarPreco(id) {
    const novoPreco = prompt(`Digite o novo preço para o ID ${id}:`);
    if (novoPreco && !isNaN(novoPreco)) {
        alert(`Preço atualizado para R$ ${novoPreco}. (O Trigger SQL log_precos foi acionado)`);
        // Aqui enviarias o UPDATE para o banco
    }
}

function excluirProduto(id) {
    if (confirm("Deseja realmente desativar este produto?")) {
        alert(`Produto ${id} marcado como inativo (Soft Delete).`);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderizarTabela(produtosIniciais);
});
