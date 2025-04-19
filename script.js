var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/script.js

// src/domManipulation.js
var salas = [
  { nome: "Sa\xFAde: Enfermagem e Nutri\xE7\xE3o", vagas: 36 },
  { nome: "Sa\xFAde: Psicologia e Fisioterapia", vagas: 35 },
  { nome: "Sa\xFAde: Odontologia e Farm\xE1cia", vagas: 35 },
  { nome: "Sa\xFAde: Medicina", vagas: 143 },
  // Limite especial
  { nome: "Engenharia Civil e Arquitetura", vagas: 35 },
  { nome: "Administra\xE7\xE3o e Contabilidade", vagas: 35 },
  { nome: "Carreiras Militares: Policiais e Bombeiros", vagas: 35 },
  { nome: "Direito", vagas: 35 },
  { nome: "Comunica\xE7\xE3o e Marketing", vagas: 35 },
  { nome: "Empreendedorismo", vagas: 35 },
  { nome: "Educa\xE7\xE3o e Servi\xE7o Social", vagas: 35 },
  { nome: "TI - Tecnologia da Informa\xE7\xE3o", vagas: 35 }
];
function appendOptions() {
  let select = document.getElementById("sala");
  salas.forEach((sala) => {
    const option = document.createElement("option");
    option.value = sala.nome;
    option.id = sala.nome;
    option.textContent = `${sala.nome} - ${sala.vagasOcupadas}/${sala.vagas}`;
    select.appendChild(option);
  });
}
function updateOptions(salas2) {
  salas2.forEach((sala) => {
    const option = document.getElementById(sala.nome);
    if (sala.vagas <= sala.vagasOcupadas) option.disabled = true;
    return option.textContent = `${sala.nome} - ${sala.vagasOcupadas}/${sala.vagas}`;
  });
}
document.addEventListener("DOMContentLoaded", () => {
});
setInterval(() => {
  salas = filterSalaLength(salas);
  updateOptions(salas);
}, 1e3);
setTimeout(() => {
  salas = filterSalaLength(salas);
  appendOptions();
}, 2e3);

// src/status.js
function MessageSucess(texto, tipo = "sucesso") {
  const statusDiv = document.getElementById("statusSala");
  statusDiv.innerText = texto;
  statusDiv.className = `sucesso ${tipo}`;
  statusDiv.style.display = "block";
  setTimeout(() => {
    statusDiv.style.opacity = "0";
    setTimeout(() => {
      statusDiv.style.display = "none";
      statusDiv.style.opacity = "1";
    }, 500);
  }, 3e3);
}
function MessageError(texto, tipo = "error") {
  const statusDiv = document.getElementById("statusSala");
  statusDiv.innerText = texto;
  statusDiv.className = `erro ${tipo}`;
  statusDiv.style.display = "block";
  setTimeout(() => {
    statusDiv.style.opacity = "0";
    setTimeout(() => {
      statusDiv.style.display = "none";
      statusDiv.style.opacity = "1";
    }, 500);
  }, 3e3);
}
function showEmailError(isValid) {
  const spanError = document.getElementById("email-error");
  if (!spanError) {
    console.error("Elemento com ID 'email-error' n\xE3o encontrado.");
    return;
  }
  spanError.style.display = isValid ? "none" : "block";
}

// src/script.js
var form = document.getElementById("formInfor");
var alunoSala = {};
var conteudoPlanilha = [];
function CheckEmail(email) {
  const [localPart, domain] = email.split("@");
  if (!domain || domain != "aluno.ce.gov.br") return false;
  else return true;
}
function filterSalaLength(salas2) {
  const salasComVagasOcupadas = salas2.map((sala) => {
    let vagasOcupadas = conteudoPlanilha.filter(
      (item) => item.sala == sala.nome
    ).length;
    return { ...sala, vagasOcupadas };
  });
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
  form.reset();
  const checkEmail = CheckEmail(data.email);
  showEmailError(checkEmail);
  if (!checkEmail) {
    return;
  }
  const alunoJaCadastrado = conteudoPlanilha.some(
    (item) => item.name === data.name && item.serie === data.serie && item.turma === data.turma
  );
  if (alunoJaCadastrado) {
    MessageError("Aluno j\xE1 registrado em uma das salas!");
    return;
  }
  if (!alunoSala[data.sala]) {
    alunoSala[data.sala] = [];
  }
  const AlunoNaSala = conteudoPlanilha.filter(
    (item) => item.sala == data.sala
  ).length;
  if (alunoSala[data.sala].length < 35) {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzbolJqHSF7RmbhweybwEwcB08_tY2Ta1Lo9CRPvEk3nqf2WnTFHe08C3Mzm7WVv87YTA/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }
      );
      MessageSucess("Aluno(a) cadastrado com sucesso!");
    } catch (err) {
      MediaError("Erro de conex\xE3o");
    }
  }
  alunoSala[data.sala].push(data.name);
  atualizarContadores();
});
async function getData() {
  const SPREADSHEET_ID = "1Fv-eEOvS1Pd3xb73WHmS5ARwN3rgliBxGFmNAQVcBXg";
  const API_KEY = "AIzaSyDtLBcFDLEuprUFz6K-nTLiqIf1e9ErLpE";
  const RANGE = "Sheet1!A:D";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const formatted = formatData(data.values);
    conteudoPlanilha = formatted;
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
    sala: row[3]
  }));
}
async function loopAtualizacao() {
  await getData();
  setInterval(async () => {
    await getData();
    const salasComVagasOcupadas = filterSalaLength(salas);
    updateOptions(salasComVagasOcupadas);
  }, 1e3);
}
document.addEventListener("DOMContentLoaded", loopAtualizacao);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  conteudoPlanilha,
  filterSalaLength
});
