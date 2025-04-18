import { salas, updateOptions } from "./domManipulation.js";

const form = document.getElementById("formInfor");

let alunoSala = {};
export let conteudoPlanilha = []


export function filterSalaLength(salas) {
  const salasComVagasOcupadas = salas.map((sala) => {
    // Calcular o número de vagas ocupadas para cada sala
    let vagasOcupadas = conteudoPlanilha.filter(
      (item) => item.sala == sala.nome
    ).length;
    // Retornar um novo objeto com as vagas ocupadas
    return { ...sala, vagasOcupadas };
  });

  // Agora, você deve retornar ou fazer algo com salasComVagasOcupadas, como armazená-lo
  return salasComVagasOcupadas;

}

function atualizarContadores() {
  for (const sala in alunoSala) {
    const contador = document.getElementById(
      `contador-sala-${sala.split(" ")[1]}`
    );
    if (contador) {
      contador.innerText = alunoSala[sala].length;
    }
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  console.log(data);
  form.reset()
  
  const aluno = data.name;
  const sala = data.sala;

  // Verifica se o aluno já está cadastrado na sala
  const alunoJaCadastrado = conteudoPlanilha.some(
    (item) => item.name === aluno && item.sala === sala
  )
  if (alunoJaCadastrado) {
    MediaError("Aluno já cadastrado nesta sala!");
    return
  }

  if (!alunoSala[sala]) {
    alunoSala[sala] = [];
  }
  
  const AlunoNaSala = conteudoPlanilha.filter((item) => item.sala == data.sala).length

  if (alunoSala[sala].length < 35) {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxYkpKfbgJWpfvd8vsq8AN0E854b0OW8Ffbge8NX68rsd377X5sAn8UwrGfZd5A8YPapA/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      ) 
      MessageSucess("Aluno(a) cadastrado com sucesso!");
    } catch (err) {
      MediaError("Erro de conexão");
    }
}

  alunoSala[sala].push(data.name)
  atualizarContadores()
  })

async function getData() {
  const SPREADSHEET_ID = "1Fv-eEOvS1Pd3xb73WHmS5ARwN3rgliBxGFmNAQVcBXg";
  const API_KEY = "AIzaSyDtLBcFDLEuprUFz6K-nTLiqIf1e9ErLpE";
  const RANGE = "Sheet1!A:D";
    //URL de conexão com a planilha para o GET usando a API KEY
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const formatted = formatData(data.values);
    conteudoPlanilha = formatted
    console.log(formatted); // Aqui você terá os objetos prontos
  } catch (err) {
    console.log("Erro ao buscar dados:", err);
  }
}

function formatData(values) {
  const [, ...rows] = values;
  return rows.map((row) => ({
    name: row[0],
    turma: row[1],
    serie: row[2],
    sala: row[3],
  }));
}

async function loopAtualizacao() {
  await getData(); // Executa imediatamente
  setInterval(async () => {
    await getData();
    const salasComVagasOcupadas = filterSalaLength(salas)
    updateOptions(salasComVagasOcupadas) // Executa a cada 10 segundos
  }, 1000);
}

// Chama isso quando o DOM estiver pronto:
document.addEventListener("DOMContentLoaded", loopAtualizacao);
