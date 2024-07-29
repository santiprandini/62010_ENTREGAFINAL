// Clave de NewsAPI
const API_KEY = 'cca26c3d651e4003881fc4142a7ffd5d'; 

// Función para obtener noticias de NewsAPI
async function obtenerNoticias() {
    try {
        const fechaHoy = new Date();
        const fechaInicio = new Date(fechaHoy);
        fechaInicio.setDate(fechaHoy.getDate() - 7); // Fecha de hace 7 días

        // Formatear fechas en formato YYYY-MM-DD
        const fechaHoyFormateada = fechaHoy.toISOString().split('T')[0];
        const fechaInicioFormateada = fechaInicio.toISOString().split('T')[0];

        const respuesta = await fetch(`https://newsapi.org/v2/everything?q="Provincia de Buenos Aires"&from=${fechaInicioFormateada}&to=${fechaHoyFormateada}&language=es&sortBy=popularity&apiKey=${API_KEY}`);
        const datos = await respuesta.json();
        return datos.articles;
    } catch (error) {
        console.error('Error al obtener noticias:', error);
        return [];
    }
}


// Función para buscar en los documentos
async function buscadorDocumentos(query) {
    const documentos = await obtenerNoticias();
    const resultados = [];
    documentos.forEach((doc, index) => {
        const title = doc.title ? doc.title.toLowerCase() : '';
        const description = doc.description ? doc.description.toLowerCase() : '';
        if (title.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
            resultados.push(index);
        }
    });
    return resultados;
}

// Función para mostrar el total de noticias del día
async function mostrarTotalNoticias() {
    const documentos = await obtenerNoticias();
    const totalNoticias = documentos.length;
    document.getElementById('totalNoticias').textContent = `Total de noticias en la última semana: ${totalNoticias}`;
}

// Función para mostrar los resultados de la búsqueda
async function mostrarResultados(query) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = ''; // Limpiamos resultados anteriores

    const documentos = await obtenerNoticias();
    const resultados = await buscadorDocumentos(query);

    if (resultados.length > 0) {
        resultados.forEach(resultado => {
            const doc = documentos[resultado];
            const textoResaltado = resaltarTexto(query, `${doc.title || ''}: ${doc.description || ''}`);
            const urlNoticia = doc.url || ''; // Obtener URL de la noticia
            const fuenteNoticia = doc.source.name || 'Fuente no disponible'; // Obtener fuente de la noticia

            const nuevoResultado = document.createElement('p');
            nuevoResultado.innerHTML = `
                Palabra "${query}" encontrada en: ${textoResaltado} <br>
                <a href="${urlNoticia}" target="_blank">Leer noticia completa</a> <br>
                <span><strong>Fuente:</strong> ${fuenteNoticia}</span>
            `;
            resultadosDiv.appendChild(nuevoResultado);
        });
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
        mostrarResultados(query);
    } else {
        alert("Por favor, ingresa una palabra para buscar.");
    }
}

// Event listeners
document.getElementById('searchButton').addEventListener('click', iniciarBusqueda);
document.getElementById('clearButton').addEventListener('click', limpiarBusquedasAnteriores);
document.addEventListener('DOMContentLoaded', () => {
    mostrarBusquedasAnteriores();
    mostrarTotalNoticias(); // Mostrar el total de noticias al cargar la página
});