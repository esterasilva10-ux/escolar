// --------------------------------------------------------------------
// --- FUNÇÕES DA ÁREA DE ALUNOS
// --------------------------------------------------------------------

const modalOverlay = document.getElementById('modal-overlay');
const form = document.getElementById('enrollment-form');
const alunosListBody = document.getElementById('alunos-list');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');

// ----------------------- MODAL ------------------------

function openModal() {
    if (form) form.reset();
    if (modalOverlay) {
        modalOverlay.classList.remove('hidden');
        setTimeout(() => modalOverlay.classList.add('active'), 10);
    }
}

function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        modalOverlay.addEventListener('transitionend', function handler() {
            modalOverlay.classList.add('hidden');
            modalOverlay.removeEventListener('transitionend', handler);
        }, { once: true });
    }
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) closeModal();
    });
}

// ----------------------- STORAGE ------------------------

function getAlunos() {
    const alunosJson = localStorage.getItem('alunos');
    return alunosJson ? JSON.parse(alunosJson) : [];
}

function saveAlunos(alunos) {
    localStorage.setItem('alunos', JSON.stringify(alunos));
}

function gerarMatricula() {
    return 'MAT-' + Date.now().toString().slice(-6);
}

// ----------------------- LISTAGEM ------------------------

function renderizarAlunos(filtro = '') {
    if (!alunosListBody) return;
    
    const alunos = getAlunos();
    const alunosTable = document.getElementById('alunos-table');

    const filtrados = alunos.filter(a =>
        a.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        a.turma.toLowerCase().includes(filtro.toLowerCase()) ||
        a.matricula.toLowerCase().includes(filtro.toLowerCase())
    );

    alunosListBody.innerHTML = '';

    if (filtrados.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (alunosTable) alunosTable.style.display = 'none';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        if (alunosTable) alunosTable.style.display = 'table';

        filtrados.forEach(aluno => {
            const row = alunosListBody.insertRow();

            row.insertCell().textContent = aluno.matricula;
            row.insertCell().textContent = aluno.nome;
            row.insertCell().textContent = aluno.turma;

            const dataBR = new Date(aluno.nascimento).toLocaleDateString('pt-BR');
            row.insertCell().textContent = dataBR;

            const acoes = row.insertCell();
            acoes.innerHTML = `
                <button class="action-btn view-btn"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete-btn" onclick="deletarAluno('${aluno.matricula}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        });
    }
}

// ------------------ AÇÕES CRUD -------------------

function matricularAluno(e) {
    e.preventDefault();

    const novoAluno = {
        matricula: gerarMatricula(),
        nome: document.getElementById('nome-aluno').value.trim(),
        nascimento: document.getElementById('data-nasc').value,
        turma: document.getElementById('turma-aluno').value,
        emailResponsavel: document.getElementById('email-responsavel').value
    };

    const alunos = getAlunos();
    alunos.push(novoAluno);
    saveAlunos(alunos);

    closeModal();
    renderizarAlunos();
}

function buscarAlunos() {
    if (searchInput) {
        renderizarAlunos(searchInput.value);
    }
}

function deletarAluno(matricula) {
    if (confirm(`Deseja excluir o aluno ${matricula}?`)) {
        let alunos = getAlunos();
        alunos = alunos.filter(a => a.matricula !== matricula);
        saveAlunos(alunos);
        renderizarAlunos();
    }
}

// Inicialização
if (form) {
    form.addEventListener('submit', matricularAluno);
}

// Carregar dados iniciais quando a página estiver pronta
document.addEventListener('DOMContentLoaded', function() {
    // Insere aluno de exemplo se não houver alunos
    const alunos = getAlunos();
    if (alunos.length === 0) {
        const alunoExemplo = {
            matricula: 'MAT1764163606945',
            nome: 'Dudu',
            nascimento: '2008-04-15',
            turma: '1º Ano A',
            emailResponsavel: 'responsavel@email.com'
        };
        alunos.push(alunoExemplo);
        saveAlunos(alunos);
    }
    renderizarAlunos();
});