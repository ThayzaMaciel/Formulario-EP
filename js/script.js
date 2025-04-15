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

    form.addEventListener("submit", async (e)=> {
        e.preventDefault()
        const formData = new FormData(form)

        const data = {}
        formData.forEach((value, key)=> {
            data[key] = value
        })
        console.log(data)

        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbwC-x2gCBe5uXB-tALBsyw0WBTV0rFWRYjZw_WIBdF-TYx7fOt9wLWI5uM6ZhbdCgJD/exec", {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

        } catch (err) {
            MediaError("Erro de conexão")
        }

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

    

