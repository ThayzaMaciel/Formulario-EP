export function MessageSucess(texto, tipo = "sucesso") {
    const statusDiv = document.getElementById('statusSala');

    statusDiv.innerText = texto;
    statusDiv.className = `sucesso ${tipo}`;
    statusDiv.style.display = 'block';

    setTimeout(() =>{
        statusDiv.style.opacity = '0';
        setTimeout(() =>{
            statusDiv.style.display = 'none';
            statusDiv.style.opacity = '1'
         }, 500);
    }, 3000)

}

export function MessageError(texto, tipo = "error") {
    const statusDiv = document.getElementById('statusSala');

    statusDiv.innerText = texto;
    statusDiv.className = `erro ${tipo}`;
    statusDiv.style.display = 'block';

    setTimeout(() =>{
        statusDiv.style.opacity = '0';
        setTimeout(() =>{
            statusDiv.style.display = 'none';
            statusDiv.style.opacity = '1'
         }, 500);
    }, 3000)

}

export function showEmailError(isValid) {
  const spanError = document.getElementById("email-error");
  if (!spanError) {
    console.error("Elemento com ID 'email-error' não encontrado.");
    return;
  }
  spanError.style.display = isValid ? "none" : "block";
}