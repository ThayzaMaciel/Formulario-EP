function MessageSucess(texto, tipo = "sucesso") {
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

function MessageErro(texto, tipo = "error") {
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