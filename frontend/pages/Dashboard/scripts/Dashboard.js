


// =========================================================================
// I. Variáveis Globais e Configuração
// =========================================================================

const sections = document.querySelectorAll('main section');
const navItems = document.querySelectorAll('.nav-menu ul li');

// Referências aos Modais
const modalAlunosOverlay = document.getElementById('modal-alunos-overlay');
const modalTurmasOverlay = document.getElementById('modal-turmas-overlay');

// Variáveis da Seção ALUNOS
const alunosSection = document.getElementById('alunos-section');
const alunosForm = document.getElementById('enrollment-form');
const alunosListBody = document.getElementById('alunos-list');
const alunosTable = document.getElementById('alunos-table');
const alunosEmptyState = document.getElementById('alunos-empty-state');
const alunosSearchInput = document.getElementById('alunos-search-input');
const totalAlunosCard = document.getElementById('total-alunos-card');

// Variáveis da Seção TURMAS
const turmasSection = document.getElementById('turmas-section');
const turmasForm = document.getElementById('new-turma-form');
const turmasListBody = document.getElementById('turmas-list');
const turmasTable = document.getElementById('turmas-table');
const turmasEmptyState = document.getElementById('turmas-empty-state');
const turmasSearchInput = document.getElementById('turmas-search-input');
const turmasAtivasCard = document.getElementById('turmas-ativas-card');


// =========================================================================
// II. Funções Comuns (Modais)
// =========================================================================

// Abre o modal correto (tipo: 'alunos' ou 'turmas')
function openModal(tipo) {
    let modalToOpen;
    let formToReset;

    if (tipo === 'alunos') {
        modalToOpen = modalAlunosOverlay;
        formToReset = alunosForm;
    } else if (tipo === 'turmas') {
        modalToOpen = modalTurmasOverlay;
        formToReset = turmasForm;
    } else {
        return; // Se o tipo não for reconhecido, não faz nada
    }

    formToReset.reset();
    modalToOpen.classList.remove('hidden');
    setTimeout(() => modalToOpen.classList.add('active'), 10);
}

// Fecha o modal correto (tipo: 'alunos' ou 'turmas')
function closeModal(tipo) {
    let modalToClose;

    if (tipo === 'alunos') {
        modalToClose = modalAlunosOverlay;
    } else if (tipo === 'turmas') {
        modalToClose = modalTurmasOverlay;
    } else {
        return;
    }

    // Verifica se o modal existe e está ativo antes de tentar fechar
    if (!modalToClose || modalToClose.classList.contains('hidden')) return;


    modalToClose.classList.remove('active');
    modalToClose.addEventListener('transitionend', function handler() {
        modalToClose.classList.add('hidden');
        modalToClose.removeEventListener('transitionend', handler);
    }, { once: true });
}

// --- NOVO/CORRIGIDO: Fechamento ao clicar fora do Modal ---
if (modalAlunosOverlay) {
    modalAlunosOverlay.addEventListener('click', e => {
        // Se o clique foi no overlay e não no conteúdo do modal
        if (e.target === modalAlunosOverlay) {
            closeModal('alunos');
        }
    });
}
if (modalTurmasOverlay) {
    modalTurmasOverlay.addEventListener('click', e => {
        // Se o clique foi no overlay e não no conteúdo do modal
        if (e.target === modalTurmasOverlay) {
            closeModal('turmas');
        }
    });
}
// --- FIM DA CORREÇÃO ---


// =========================================================================
// III. Funções Alunos
// =========================================================================

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

function renderizarAlunos(filtro = '') {
    const alunos = getAlunos();

    // Atualiza o card de estatísticas
    totalAlunosCard.textContent = alunos.length;

    const filtrados = alunos.filter(a =>
        a.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        a.turma.toLowerCase().includes(filtro.toLowerCase()) ||
        a.matricula.toLowerCase().includes(filtro.toLowerCase())
    );

    alunosListBody.innerHTML = '';

    if (filtrados.length === 0) {
        alunosEmptyState.style.display = 'block';
        alunosTable.style.display = 'none';
    } else {
        alunosEmptyState.style.display = 'none';
        alunosTable.style.display = 'table';

        filtrados.forEach(aluno => {
            const row = alunosListBody.insertRow();
            row.insertCell().textContent = aluno.matricula;
            row.insertCell().textContent = aluno.nome;
            row.insertCell().textContent = aluno.turma;

            // 'T00:00:00' para corrigir o fuso horário
            const dataBR = new Date(aluno.nascimento + 'T00:00:00').toLocaleDateString('pt-BR');
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

function matriculaAluno(e) {
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

    closeModal('alunos');
    renderizarAlunos();
}

function buscarAlunos() {
    renderizarAlunos(alunosSearchInput.value);
}

function deletarAluno(matricula) {
    if (confirm(`Deseja excluir o aluno de matrícula ${matricula}?`)) {
        let alunos = getAlunos();
        alunos = alunos.filter(a => a.matricula !== matricula);
        saveAlunos(alunos);
        renderizarAlunos();
    }
}

alunosForm.addEventListener('submit', matriculaAluno);
alunosSearchInput.addEventListener('keyup', buscarAlunos);


// =========================================================================
// IV. Funções Turmas
// =========================================================================

function getTurmas() {
    const turmasJson = localStorage.getItem('turmas');
    const defaultTurmas = [
        { nome: '6º Ano A', nivel: 'Ensino Fundamental', dataInicio: '2024-03-01', vagas: '30' },
        { nome: '3º Ano C', nivel: 'Ensino Médio', dataInicio: '2024-03-01', vagas: '35' },
        { nome: 'Técnico em Informática', nivel: 'Cursos Técnicos', dataInicio: '2024-04-15', vagas: '40' }
    ];

    if (!turmasJson || JSON.parse(turmasJson).length === 0) {
        // Salva os padrões apenas se não houver NADA (para não sobrescrever depois)
        if (!turmasJson) {
            saveTurmas(defaultTurmas);
            return defaultTurmas;
        }
    }

    return JSON.parse(turmasJson);
}

function saveTurmas(turmas) {
    localStorage.setItem('turmas', JSON.stringify(turmas));
}

function renderizarTurmas(filtro = '') {
    const turmas = getTurmas();

    // Atualiza o card de estatísticas
    turmasAtivasCard.textContent = turmas.length;

    const turmasFiltradas = turmas.filter(turma =>
        turma.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        turma.nivel.toLowerCase().includes(filtro.toLowerCase())
    );

    turmasListBody.innerHTML = '';

    if (turmasFiltradas.length === 0) {
        turmasEmptyState.style.display = 'block';
        turmasTable.style.display = 'none';
    } else {
        turmasEmptyState.style.display = 'none';
        turmasTable.style.display = 'table';

        turmasFiltradas.forEach(turma => {
            const row = turmasListBody.insertRow();
            row.insertCell().textContent = turma.nome;
            row.insertCell().textContent = turma.nivel;

            const dataFormatada = new Date(turma.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR');
            row.insertCell().textContent = dataFormatada;

            row.insertCell().textContent = `${turma.vagas}`;

            const acoesCell = row.insertCell();
            const key = turma.nome + turma.dataInicio;
            acoesCell.innerHTML = `
                        <button class="action-btn view-btn" title="Ver Detalhes"><i class="fas fa-eye"></i></button>
                        <button class="action-btn delete-btn" title="Excluir" onclick="deletarTurma('${key}')"><i class="fas fa-trash"></i></button>
                    `;
        });
    }
}

function cadastrarTurma(event) {
    event.preventDefault();

    const novoTurma = {
        nome: document.getElementById('nome-turma').value.trim(),
        nivel: document.getElementById('nivel-ensino').value,
        dataInicio: document.getElementById('data-inicio').value,
        vagas: document.getElementById('max-alunos').value
    };

    const turmaKey = novoTurma.nome + novoTurma.dataInicio;
    let turmas = getTurmas();

    const existe = turmas.some(t => (t.nome + t.dataInicio) === turmaKey);

    if (existe) {
        alert(`Erro: Já existe uma turma com o nome "${novoTurma.nome}" e data de início.`);
        return;
    }

    turmas.push(novoTurma);
    saveTurmas(turmas);

    closeModal('turmas');
    renderizarTurmas();
}

function buscarTurmas() {
    renderizarTurmas(turmasSearchInput.value);
}

function deletarTurma(key) {
    if (confirm(`Tem certeza que deseja excluir esta turma?`)) {
        let turmas = getTurmas();
        turmas = turmas.filter(turma => (turma.nome + turma.dataInicio) !== key);
        saveTurmas(turmas);
        renderizarTurmas();
    }
}

turmasForm.addEventListener('submit', cadastrarTurma);
turmasSearchInput.addEventListener('keyup', buscarTurmas);


// =========================================================================
// V. Funções de Navegação e Inicialização
// =========================================================================

const sectionMap = {
    'dashboard': 'dashboard-section',
    'alunos': 'alunos-section',
    'turmas': 'turmas-section',
    'matriculas': 'matriculas-section',
    'notas': 'notas-section',
    'solicitacoes': 'solicitacoes-section'
};

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetId = sectionMap[item.getAttribute('data-target')];

        // 1. Atualiza o estado "active" do menu
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // 2. Controla a visibilidade das seções
        sections.forEach(sec => sec.style.display = 'none');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        // 3. Carrega os dados da seção (se for Alunos ou Turmas)
        if (targetId === "alunos-section") {
            renderizarAlunos();
        } else if (targetId === "turmas-section") {
            renderizarTurmas();
        } else if (targetId === "dashboard-section") {
            // Atualiza os dados dos cards no Dashboard
            totalAlunosCard.textContent = getAlunos().length;
            turmasAtivasCard.textContent = getTurmas().length;
        }
    });
});

// Configuração inicial ao carregar a página
window.addEventListener('load', () => {
    // Garante que o Dashboard esteja visível inicialmente
    document.getElementById('dashboard-section').style.display = 'block';

    // Inicializa os dados dos cards no Dashboard
    totalAlunosCard.textContent = getAlunos().length;
    turmasAtivasCard.textContent = getTurmas().length;
});

