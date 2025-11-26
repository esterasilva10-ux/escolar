// --------------------------------------------------------------------
// --- FUNÇÕES DA ÁREA DE ALUNOS (funcionam apenas dentro do dashboard)
// --------------------------------------------------------------------

const modalOverlay = document.getElementById('modal-overlay');
const form = document.getElementById('enrollment-form');
const alunosListBody = document.getElementById('alunos-list');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');

// ----------------------- MODAL ------------------------

function openModal() {
    form.reset();
    modalOverlay.classList.remove('hidden');
    setTimeout(() => modalOverlay.classList.add('active'), 10);
}

function closeModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.addEventListener('transitionend', function handler() {
        modalOverlay.classList.add('hidden');
        modalOverlay.removeEventListener('transitionend', handler);
    }, { once: true });
}

modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
});

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
    const alunos = getAlunos();

    const filtrados = alunos.filter(a =>
        a.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        a.turma.toLowerCase().includes(filtro.toLowerCase()) ||
        a.matricula.toLowerCase().includes(filtro.toLowerCase())
    );

    alunosListBody.innerHTML = '';

    if (filtrados.length === 0) {
        emptyState.style.display = 'block';
        document.getElementById('alunos-table').style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        document.getElementById('alunos-table').style.display = 'table';

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

// Função para abrir o modal
function openModal() {
    document.getElementById("modal-overlay").classList.remove("hidden");
}

// Função para fechar o modal
function closeModal() {
    document.getElementById("modal-overlay").classList.add("hidden");
}

// Inserir 1 aluno fixo ao carregar
window.onload = function () {
    const tabela = document.getElementById("alunos-list");
    const emptyState = document.getElementById("empty-state");

    // Criando um aluno padrão
    const aluno = `
        <tr>
            <td>MAT1764163606945</td>
            <td>Dudu</td>
            <td>1º Ano A</td>
            <td>15/04/2008</td>
            <td>
                <i class="fas fa-edit action-btn"></i>
                <i class="fas fa-trash action-btn"></i>
            </td>
        </tr>
    `;

    tabela.innerHTML = aluno;
    emptyState.style.display = "none";
};
