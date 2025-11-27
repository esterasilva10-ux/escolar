// --------------------------------------------------------------------
// --- FUNÇÕES DA ÁREA DE TURMAS
// --------------------------------------------------------------------

const turmaModalOverlay = document.getElementById('modal-overlay');
const turmaForm = document.getElementById('new-turma-form');
const turmasListBody = document.getElementById('turmas-list');
const turmaEmptyState = document.getElementById('empty-state');
const turmaSearchInput = document.getElementById('search-input');
const turmasTable = document.getElementById('turmas-table');

// --- Funções de Controle do Modal ---
function openTurmaModal() {
    if (turmaForm) turmaForm.reset();
    if (turmaModalOverlay) {
        turmaModalOverlay.classList.remove('hidden');
        setTimeout(() => {
            turmaModalOverlay.classList.add('active');
        }, 10);
    }
}

function closeTurmaModal() {
    if (turmaModalOverlay) {
        turmaModalOverlay.classList.remove('active');
        turmaModalOverlay.addEventListener('transitionend', function handler() {
            turmaModalOverlay.classList.add('hidden');
            turmaModalOverlay.removeEventListener('transitionend', handler);
        }, { once: true });
    }
}

if (turmaModalOverlay) {
    turmaModalOverlay.addEventListener('click', (e) => {
        if (e.target === turmaModalOverlay) {
            closeTurmaModal();
        }
    });
}

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
    if (!turmasListBody) return;
    
    const turmas = getTurmas();

    const turmasFiltradas = turmas.filter(turma =>
        turma.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        turma.nivel.toLowerCase().includes(filtro.toLowerCase())
    );

    turmasListBody.innerHTML = '';

    if (turmasFiltradas.length === 0) {
        if (turmaEmptyState) turmaEmptyState.style.display = 'block';
        if (turmasTable) turmasTable.style.display = 'none';
    } else {
        if (turmaEmptyState) turmaEmptyState.style.display = 'none';
        if (turmasTable) turmasTable.style.display = 'table';

        turmasFiltradas.forEach(turma => {
            const row = turmasListBody.insertRow();

            row.insertCell().textContent = turma.nome;
            row.insertCell().textContent = turma.nivel;

            const dataFormatada = new Date(turma.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR');
            row.insertCell().textContent = dataFormatada;

            row.insertCell().textContent = `${turma.vagas} vagas`;

            const acoesCell = row.insertCell();
            acoesCell.innerHTML = `
                <button class="action-btn view-btn" title="Ver Detalhes"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete-btn" title="Excluir" onclick="deletarTurma('${turma.nome + turma.dataInicio}')"><i class="fas fa-trash"></i></button>
            `;

            row.setAttribute('data-key', turma.nome + turma.dataInicio);
        });
    }
}

// --- Funções de Ação (CRUD) ---
function cadastrarTurma(event) {
    event.preventDefault();

    const novoTurma = {
        nome: document.getElementById('nome-turma').value.trim(),
        nivel: document.getElementById('nivel-ensino').value,
        dataInicio: document.getElementById('data-inicio').value,
        vagas: document.getElementById('max-alunos').value
    };

    const turmaKey = novoTurma.nome + novoTurma.dataInicio;
    const turmas = getTurmas();

    const existe = turmas.some(t => (t.nome + t.dataInicio) === turmaKey);

    if (existe) {
        alert(`Erro: Já existe uma turma com o nome "${novoTurma.nome}" e data de início ${new Date(novoTurma.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')}.`);
        return;
    }

    turmas.push(novoTurma);
    saveTurmas(turmas);

    closeTurmaModal();
    renderizarTurmas();
}

function buscarTurmas() {
    if (turmaSearchInput) {
        const filtro = turmaSearchInput.value;
        renderizarTurmas(filtro);
    }
}

function deletarTurma(key) {
    if (confirm(`Tem certeza que deseja excluir esta turma?`)) {
        let turmas = getTurmas();
        turmas = turmas.filter(turma => (turma.nome + turma.dataInicio) !== key);
        saveTurmas(turmas);
        renderizarTurmas();
    }
}

// --- Inicialização ---
if (turmaForm) {
    turmaForm.addEventListener('submit', cadastrarTurma);
}

// Carregar dados iniciais
document.addEventListener('DOMContentLoaded', function() {
    renderizarTurmas();
});