function mostrarTela(tela) {
    // esconde todas as telas
    document.querySelectorAll("section").forEach(sec => {
        sec.style.display = "none";
    });

    // mostra a tela clicada
    document.getElementById(`${tela}-section`).style.display = "block";
}
const modalOverlay = document.getElementById('modal-overlay');
const form = document.getElementById('new-turma-form');
const turmasListBody = document.getElementById('turmas-list');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const turmasTable = document.getElementById('turmas-table');

// --- Funções de Controle do Modal ---

function openModal() {
    form.reset();
    modalOverlay.classList.remove('hidden');
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
}

function closeModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.addEventListener('transitionend', function handler() {
        modalOverlay.classList.add('hidden');
        modalOverlay.removeEventListener('transitionend', handler);
    }, { once: true });
}

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// --- Funções de Persistência (Local Storage) ---

function getTurmas() {
    const turmasJson = localStorage.getItem('turmas');
    return turmasJson ? JSON.parse(turmasJson) : [];
}

function saveTurmas(turmas) {
    localStorage.setItem('turmas', JSON.stringify(turmas));
}

// --- Geração de Conteúdo e Listagem ---

function renderizarTurmas(filtro = '') {
    const turmas = getTurmas();

    // Filtra as turmas
    const turmasFiltradas = turmas.filter(turma =>
        turma.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        turma.nivel.toLowerCase().includes(filtro.toLowerCase())
    );

    turmasListBody.innerHTML = ''; // Limpa a lista atual

    if (turmasFiltradas.length === 0) {
        emptyState.style.display = 'block';
        turmasTable.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        turmasTable.style.display = 'table';

        turmasFiltradas.forEach(turma => {
            const row = turmasListBody.insertRow();

            // Colunas ajustadas
            row.insertCell().textContent = turma.nome;
            row.insertCell().textContent = turma.nivel;

            // Data formatada para BR
            const dataFormatada = new Date(turma.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR');
            row.insertCell().textContent = dataFormatada;

            row.insertCell().textContent = `${turma.vagas} vagas`;

            // Coluna Ações
            const acoesCell = row.insertCell();
            acoesCell.innerHTML = `
                        <button class="action-btn view-btn" title="Ver Detalhes"><i class="fas fa-eye"></i></button>
                        <button class="action-btn delete-btn" title="Excluir" onclick="deletarTurma('${turma.nome + turma.dataInicio}')"><i class="fas fa-trash"></i></button>
                    `;

            // Usando uma chave composta para exclusão, já que o código/sigla foi removido
            row.setAttribute('data-key', turma.nome + turma.dataInicio);
        });
    }
}

// --- Funções de Ação (CRUD) ---

// Função de Cadastro (acionada pelo submit do formulário)
function cadastrarTurma(event) {
    event.preventDefault();

    const novoTurma = {
        nome: document.getElementById('nome-turma').value.trim(),
        nivel: document.getElementById('nivel-ensino').value,
        dataInicio: document.getElementById('data-inicio').value,
        vagas: document.getElementById('max-alunos').value
    };

    // Usando uma chave simples (Nome + Data) para identificação
    const turmaKey = novoTurma.nome + novoTurma.dataInicio;

    const turmas = getTurmas();

    // Validação de duplicidade
    const existe = turmas.some(t => (t.nome + t.dataInicio) === turmaKey);

    if (existe) {
        alert(`Erro: Já existe uma turma com o nome "${novoTurma.nome}" e data de início ${new Date(novoTurma.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')}.`);
        return;
    }

    turmas.push(novoTurma);
    saveTurmas(turmas);

    closeModal();
    renderizarTurmas(); // Atualiza a lista
}

// Função de Busca 
function buscarTurmas() {
    const filtro = searchInput.value;
    renderizarTurmas(filtro);
}

// Função de Exclusão
function deletarTurma(key) {
    if (confirm(`Tem certeza que deseja excluir esta turma?`)) {
        let turmas = getTurmas();
        // Filtra e mantém apenas as turmas que NÃO têm a chave (Nome + Data)
        turmas = turmas.filter(turma => (turma.nome + turma.dataInicio) !== key);
        saveTurmas(turmas);
        renderizarTurmas();
    }
}

// --- Inicialização ---

form.addEventListener('submit', cadastrarTurma);
window.onload = renderizarTurmas;
