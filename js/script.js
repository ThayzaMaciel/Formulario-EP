const form = document.getElementById("formInfor")


let alunoSala = {}

function atualizarContadores() {
    for (const sala in alunoSala) {
        const contador = document.getElementById(`contador-sala-${sala.split(" ")[1]}`);
        if (contador) {
            contador.innerText = alunoSala[sala].length;
        }
    }
}

    form.addEventListener("submit", (e)=> {
        e.preventDefault()
        const formData = new FormData(form)

        const data = {}
        formData.forEach((value, key)=> {
            data[key] = value
        })
        console.log(data)

        const aluno = data.name
        const sala = data.sala

       
        if(!alunoSala[sala]) {
            alunoSala[sala] = [];
        }

        if(alunoSala[sala].length < 35) {
            alunoSala[sala].push(aluno);
            MessageSucess(`Aluno(a) ${aluno} cadastrado na sala com sucesso na sala: ${sala}`)
        } else {
            MessageErro(`Sala cheia! impossivel cadastrar aluno(a) ${aluno} na sala ${sala}`)
        }
    })

    

