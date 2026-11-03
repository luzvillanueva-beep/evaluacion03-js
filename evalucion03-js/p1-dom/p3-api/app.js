const btnBuscar = document.getElementById('btn-buscar');
const inputCiudad = document.getElementById('input-ciudad');
const resultadoDiv = document.getElementById('resultado');

async function buscarClima() {
  const nombreCiudad = inputCiudad.value.trim();
  if (!nombreCiudad) {
    resultadoDiv.innerHTML = '<span style="color: red;">Por favor ingrese una ciudad.</span>';
    return;
  }

  // Estado de carga
  btnBuscar.textContent = "Cargando...";
  btnBuscar.disabled = true;
  resultadoDiv.innerHTML = "Consultando datos...";

  try {
    // 1. Primera llamada: Geocodificación (Nombre -> Coordenadas)
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nombreCiudad)}&count=1&language=es`);
    
    if (!geoRes.ok) {
      throw new Error("Error al conectar con el servidor de geocodificación.");
    }

    const geoData = await geoRes.json();

    // Validar si la ciudad no existe
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`No se encontró la ciudad "${nombreCiudad}".`);
    }

    const { latitude, longitude, name, admin1 } = geoData.results[0];

    // 2. Segunda llamada: Clima actual (Coordenadas -> Datos climáticos)
    const climaRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`);
    
    if (!climaRes.ok) {
      throw new Error("Error al obtener la información del clima.");
    }

    const climaData = await climaRes.json();
    const { temperature_2m, wind_speed_10m } = climaData.current;

    // Mostrar el resultado exitoso en el DOM
    resultadoDiv.innerHTML = `
      <p style="color: green;">✔ Datos obtenidos con éxito:</p>
      <p>📍 Ciudad: ${name} (${admin1 || 'Región no especificada'})</p>
      <p>🌡️ Temperatura: ${temperature_2m} °C</p>
      <p>💨 Velocidad del Viento: ${wind_speed_10m} km/h</p>
    `;

  } catch (error) {
    // Manejo de errores (ciudad no encontrada, sin conexión, etc.)
    resultadoDiv.innerHTML = `<p style="color: red;">❌ ${error.message}</p>`;
  } finally {
    // Restaurar el botón siempre (éxito o error)
    btnBuscar.textContent = "Buscar Clima";
    btnBuscar.disabled = false;
  }
}

// Evento click del botón
btnBuscar.addEventListener('click', buscarClima);