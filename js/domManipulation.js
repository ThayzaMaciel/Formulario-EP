import { conteudoPlanilha, filterSalaLength } from "./script.js";

export let salas = [
  { nome: "Saúde: Enfermagem e Nutrição", vagas: 36 },
  { nome: "Saúde: Psicologia e Fisioterapia", vagas: 35 },
  { nome: "Saúde: Odontologia e Farmácia", vagas: 35 },
  { nome: "Saúde: Medicina", vagas: 143 }, // Limite especial
  { nome: "Engenharia Civil e Arquitetura", vagas: 35 },
  { nome: "Administração e Contabilidade", vagas: 35 },
  { nome: "Carreiras Militares: Policiais e Bombeiros", vagas: 35 },
  { nome: "Direito", vagas: 35 },
  { nome: "Comunicação e Marketing", vagas: 35 },
  { nome: "Empreendedorismo", vagas: 35 },
  { nome: "Educação e Serviço Social", vagas: 35 },
  { nome: "TI - Tecnologia da Informação", vagas: 35 },
];

function appendOptions(){
    let select = document.getElementById("sala")

    salas.forEach((sala)=> {
        const option = document.createElement("option");
        option.value = sala.nome;
        option.textContent = `${sala.nome} - ${sala.vagasOcupadas}/${sala.vagas}`;
        select.appendChild(option);
    })
}

document.addEventListener("DOMContentLoaded", ()=> {
    
})

setTimeout(()=> {
    salas = filterSalaLength(salas);
    appendOptions();
}, 2000)