
const sections = document.querySelectorAll('main section');
console.log(sections);
const navItems = document.querySelectorAll('.nav-menu ul li');

// Ativa Dashboard como inicial
sections.forEach(sec => sec.classList.remove('active-section'));
sections[0].classList.add('active-section');

navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        sections.forEach(sec => sec.classList.remove('active-section'));
        sections[index].classList.add('active-section');

        // Atualiza dados quando entrar na seção "Alunos"
        if (sections[index].id === "alunos-section") {
            renderizarAlunos();
        }
    });
});



// ------------------ AÇÕES CRUD -------------------

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

    closeModal();
    renderizarAlunos();
}

form.addEventListener('submit', matriculaAluno);

function buscarAlunos() {
    renderizarAlunos(searchInput.value);
}

function deletarAluno(matricula) {
    if (confirm(`Deseja excluir o aluno ${matricula}?`)) {
        let alunos = getAlunos();
        alunos = alunos.filter(a => a.matricula !== matricula);
        saveAlunos(alunos);
        renderizarAlunos();

        function mostrarSecao(secaoId) {
    // Esconde todas
    document.querySelectorAll("main section").forEach(sec => sec.style.display = "none");

    // Mostra só a selecionada
    document.getElementById(secaoId).style.display = "block";
}

    }
}
