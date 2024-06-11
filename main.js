// Declaramos los documentos que serán la base del buscador, en este caso dictámenes jurídicos
const documentos = [
    { id: 1, text: "Llamado a dictaminar, este Organismo Asesor toma conocimiento de lo actuado y -sin abrir juicio sobre los montos resultantes por ser materia ajena a su competencia- no tiene observaciones que formular al trámite llevado a cabo, razón por la cual es de opinión que puede procederse a la suscripción del Acta de Redeterminación y posterior aprobación mediante el dictado del acto administrativo correspondiente." },
    { id: 2, text: "Analizado lo actuado en el marco de las normas jurídicas referenciadas y sobre la base de los informes emitidos por las Dependencias técnicas intervinientes, esta Asesoría General de Gobierno no tiene, desde el punto de vista de su competencia, objeciones que formular a la medida impulsada, razón por la cual es de opinión que puede continuarse con el trámite tendiente a dictar el acto administrativo propiciado (conf. arts. 20 de la Ley Nº 15.477 y 3º, 4º, siguientes y concordantes de la Ley Nº 11.459 y los Decretos Nº 531/19 y Nº 89/22)" },
    { id: 3, text: "Analizado el proyecto de resolución, esta Asesoría General de Gobierno no tiene en el marco de su competencia, observaciones que formular, razón por la cual es de opinión que el Ministro de Producción, Ciencia e Innovación Tecnológica, de estimarlo oportuno y conveniente, podrá proceder a su dictad" }
];

// Armamos la función para buscar en los documentos
function buscadorDocumentos(query) {
    const resultados = [];
    documentos.forEach(doc => {
        if (doc.text.toLowerCase().includes(query.toLowerCase())) {
            resultados.push(doc.id);
        }
    });
    return resultados;
}

// Armamos la función para acumular y mostrar los resultados obtenidos
function mostrarResultados(query, resultados) {
    const resultadosDiv = document.getElementById('resultados');
    const nuevoResultado = document.createElement('p'); // Creamos un nuevo párrafo para cada búsqueda
    if (resultados.length > 0) {
        nuevoResultado.textContent = `Palabra "${query}" encontrada en los documentos con ID: ${resultados.join(", ")}`;
    } else {
        nuevoResultado.textContent = `No se encontraron documentos que contengan la palabra "${query}".`;
    }
    resultadosDiv.appendChild(nuevoResultado); // Añadimos el nuevo resultado al div
}

// Armamos la función para iniciar el proceso de búsqueda con un prompt
function iniciarBusqueda() {
    let query = prompt("Ingresa una palabra para buscar en los documentos (o ingresa '-1' para salir):");
    while (query !== '-1') {
        if (query.trim() !== "") {
            const resultados = buscadorDocumentos(query);
            mostrarResultados(query, resultados);
        } else {
            alert("Por favor, ingresa una palabra para buscar.");
        }
        query = prompt("Ingresa una palabra para buscar en los documentos (o ingresa '-1' para salir):");
    }
    // Armamos un mensaje para cuando finaliza la búsqueda
    const resultadosDiv = document.getElementById('resultados');
    const mensajeFinal = document.createElement('p');
    mensajeFinal.textContent = "Búsqueda finalizada.";
    resultadosDiv.appendChild(mensajeFinal);
}

// Iniciamos la búsqueda
iniciarBusqueda();