function buscarCentros() {

    //borramos los centros del mapa
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    //obtenemos los valores del formulario
    let provincia = document.getElementById("provincia").value;
    if(provincia == "castellon" || provincia == "Castellon") provincia = "castellón"
    const localidad = document.getElementById("localidad").value;
    const codigoPostal = document.getElementById("codigoPostal").value;
    const tipo = document.getElementById("tipo").value;

    
    const url = `http://localhost:3004/centrosEducativos?provincia=${provincia}&localidad=${localidad}&codigoPostal=${codigoPostal}&tipo=${tipo}`;
    
    //realizamos la petición GET al endpoint /centrosEducativos de nuestra API de búsqueda para obtener los centros
    axios.get(url)
        .then(response => {
            const data = response.data;
            mostrarResultados(data);
        })
        .catch(error => {
            mostrarError("Error: "+error.response.data.error);
        });
}

function mostrarResultados(data) {             

    //limpiamos el contenedor donde se muestran los resultados
    const resultadoCarga = document.getElementById("resultadoCarga");  
    resultadoCarga.innerHTML = "";

    // Creamos la tabla de los centros. Los atributos _id, codigoLocalidad y __v no son relevantes y no los insertamos
    const tabla = document.createElement("table");
    tabla.classList.add("tabla-resultados");
    tabla.border = "1";    
    const encabezado = tabla.createTHead().insertRow();
    for (const atributo in data[0]) {
        if (atributo !== "_id" && atributo !== "codigoLocalidad" && atributo !== "__v") {
            const th = document.createElement("th");
            th.textContent = atributo;
            encabezado.appendChild(th);
        }
    }

    // Iteramos sobre los centros e insertamos una fila por centro
    data.forEach(centro => {
        const fila = tabla.insertRow();
        for (const atributo in centro) {
            if (atributo !== "_id" && atributo !== "codigoLocalidad" && atributo !== "__v") {
                const celda = fila.insertCell();
                celda.textContent = centro[atributo];
            }
        }

        // Añadimos el marcador del centro al mapa
        const marker = L.marker([centro.latitud, centro.longitud]).addTo(map);
        marker.bindPopup(centro.nombre);
    });

    // Añadir la tabla al contenedor de los reslutados
    resultadoCarga.appendChild(tabla);
}

function mostrarError(errorMessage) {           
    const resultadoCarga = document.getElementById("resultadoCarga");
    resultadoCarga.innerHTML = `<div style="color: red;">${errorMessage}</div>`;
}        


// Inicializar el mapa con Leaflet y OpenStreetMap
var map = L.map('mapa').setView([40.416775, -3.703790], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);