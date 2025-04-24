import { salas, updateOptions } from "./domManipulation.js";
import {
  MessageError,
  MessageSucess,
  showEmailError,
  showNameError,
} from "./status.js";

const form = document.getElementById("formInfor");

const name = document.getElementById("name");
const botao = document.getElementById("botao");

let alunoSala = {};
export let conteudoPlanilha = [];

// Função que verifica o dominio do email
function CheckEmail(email) {
  const [localPart, domain] = email.split("@");
  if (!domain || domain != "aluno.ce.gov.br") return false;
  else return true;
}
function CheckName() {
  const palavras = name.value.trim().split(/\s+/);
  if (palavras.length <= 2) return false;
  return true;
}

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

name.addEventListener("input", () => {
  let palavras = name.value.trim().split(/\s+/);

  if (palavras.length <= 2) {
    MessageError("Coloque seu nome completo.");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  await getData();
  
  console.log(data);

  const checkEmail = CheckEmail(data.email);
  showEmailError(checkEmail);
  if (!checkEmail) {
    return;
  }
  const checkName = CheckName(data.name);
  showNameError(checkName);
  if (!checkName) {
    return;
  }

  // Verifica se o aluno já está cadastrado na sala
  const alunoJaCadastrado = conteudoPlanilha.some(
    (item) =>
      item.name === data.name &&
      item.serie === data.serie &&
      item.turma === data.turma
  );
  if (alunoJaCadastrado) {
    MessageError("Aluno já registrado em uma das salas.");
    return;
  }

  if (!alunoSala[data.sala]) {
    alunoSala[data.sala] = [];
  }

  // Verifica se a sala já tem 35 alunos
  const AlunoNaSala = conteudoPlanilha.filter(
    (item) => item.sala == data.sala
  ).length;
  if (AlunoNaSala >= salas.find((sala) => sala.nome == data.sala).vagas) {
    MessageError("Essa sala já está cheia. Atualize a página para ver as vagas disponiveis.");
    form.reset()
    return;
  }

  // se a sala tiver menos de 35 alunos, adiciona o aluno
  if (alunoSala[data.sala].length < 35) {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzbolJqHSF7RmbhweybwEwcB08_tY2Ta1Lo9CRPvEk3nqf2WnTFHe08C3Mzm7WVv87YTA/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      form.reset(); 
      MessageSucess("Aluno(a) cadastrado com sucesso.");

      await getData();
      const salasComVagasOcupadas = filterSalaLength(salas);
      updateOptions(salasComVagasOcupadas);
      atualizarContadores();


    } catch (err) {
      MediaError("Erro de conexão");
    }
  }

  alunoSala[data.sala].push(data.name);
  atualizarContadores();

});

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
    conteudoPlanilha = formatted; // Aqui você terá os objetos prontos
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
    const salasComVagasOcupadas = filterSalaLength(salas);
    // updateOptions(salasComVagasOcupadas); essa é a linha que tava atualizando
  }, 1000);
}

// Chama isso quando o DOM estiver pronto:
document.addEventListener("DOMContentLoaded", loopAtualizacao);
