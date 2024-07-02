// Declaramos los documentos que serán la base del buscador, en este caso dictámenes jurídicos
const documentos = [
    { id: 1, text: "Llamado a dictaminar, este Organismo Asesor toma conocimiento de lo actuado y -sin abrir juicio sobre los montos resultantes por ser materia ajena a su competencia- no tiene observaciones que formular al trámite llevado a cabo, razón por la cual es de opinión que puede procederse a la suscripción del Acta de Redeterminación y posterior aprobación mediante el dictado del acto administrativo correspondiente." },
    { id: 2, text: "Analizado lo actuado en el marco de las normas jurídicas referenciadas y sobre la base de los informes emitidos por las Dependencias técnicas intervinientes, esta Asesoría General de Gobierno no tiene, desde el punto de vista de su competencia, objeciones que formular a la medida impulsada, razón por la cual es de opinión que puede continuarse con el trámite tendiente a dictar el acto administrativo propiciado (conf. arts. 20 de la Ley Nº 15.477 y 3º, 4º, siguientes y concordantes de la Ley Nº 11.459 y los Decretos Nº 531/19 y Nº 89/22)" },
    { id: 3, text: "Analizado el proyecto de resolución, esta Asesoría General de Gobierno no tiene en el marco de su competencia, observaciones que formular, razón por la cual es de opinión que el Ministro de Producción, Ciencia e Innovación Tecnológica, de estimarlo oportuno y conveniente, podrá proceder a su dictad" }
];

// Función para buscar en los documentos
function buscadorDocumentos(query) {
    const resultados = [];
    documentos.forEach(doc => {
        if (doc.text.toLowerCase().includes(query.toLowerCase())) {
            resultados.push(doc.id);
        }
    });
    return resultados;
}

// Función para mostrar los resultados de la búsqueda
function mostrarResultados(query, resultados) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = ''; // Limpiamos resultados anteriores

    if (resultados.length > 0) {
        const ultimoResultado = resultados[resultados.length - 1]; // Último resultado encontrado
        const documento = documentos.find(doc => doc.id === ultimoResultado);

        if (documento) {
            const texto = documento.text;
            const textoResaltado = resaltarTexto(query, texto); // Función para resaltar el texto
            const nuevoResultado = document.createElement('p');
            nuevoResultado.innerHTML = `Palabra "${query}" encontrada en el documento con ID ${ultimoResultado}: ${textoResaltado}`;
            resultadosDiv.appendChild(nuevoResultado);
        } else {
            const nuevoResultado = document.createElement('p');
            nuevoResultado.textContent = `No se encontró el documento con ID ${ultimoResultado}.`;
            resultadosDiv.appendChild(nuevoResultado);
        }
    } else {
        const nuevoResultado = document.createElement('p');
        nuevoResultado.textContent = `No se encontraron documentos que contengan la palabra "${query}".`;
        resultadosDiv.appendChild(nuevoResultado);
    }
    guardarBusqueda(query, resultados); // Guardar la búsqueda después de mostrar resultados
}

// Función para resaltar la palabra buscada en el texto del documento
function resaltarTexto(query, texto) {
    return texto.replace(new RegExp(query, 'gi'), match => `<b>${match}</b>`);
}

// Función para guardar la búsqueda en el local storage
function guardarBusqueda(query, resultados) {
    let busquedasAnteriores = JSON.parse(localStorage.getItem('busquedasAnteriores')) || [];
    busquedasAnteriores.push({ query, resultados });
    localStorage.setItem('busquedasAnteriores', JSON.stringify(busquedasAnteriores));
    mostrarBusquedasAnteriores();
}

// Función para mostrar las búsquedas anteriores
function mostrarBusquedasAnteriores() {
    const busquedasAnterioresDiv = document.getElementById('busquedasAnteriores');
    busquedasAnterioresDiv.innerHTML = ''; // Limpiar búsquedas anteriores
    let busquedasAnteriores = JSON.parse(localStorage.getItem('busquedasAnteriores')) || [];
    busquedasAnteriores.forEach(busqueda => {
        const nuevoResultado = document.createElement('div');
        nuevoResultado.classList.add('result-item');
        nuevoResultado.textContent = `Palabra "${busqueda.query}" encontrada en los documentos con ID: ${busqueda.resultados.join(", ")}`;
        busquedasAnterioresDiv.appendChild(nuevoResultado);
    });
}

// Función para limpiar las búsquedas anteriores
function limpiarBusquedasAnteriores() {
    localStorage.removeItem('busquedasAnteriores');
    mostrarBusquedasAnteriores();
}

// Función para iniciar la búsqueda
function iniciarBusqueda() {
    const query = document.getElementById('searchInput').value;
    if (query.trim() !== "") {
        const resultados = buscadorDocumentos(query);
        mostrarResultados(query, resultados);
    } else {
        alert("Por favor, ingresa una palabra para buscar.");
    }
}

// Event listeners
document.getElementById('searchButton').addEventListener('click', iniciarBusqueda);
document.getElementById('clearButton').addEventListener('click', limpiarBusquedasAnteriores);
document.addEventListener('DOMContentLoaded', mostrarBusquedasAnteriores);