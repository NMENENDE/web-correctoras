let modoEdicion = false;
let filaEditando = null;

function guardarDatos(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const nCliente = document.getElementById("nCliente").value;
  const razonSocial = document.getElementById("razonSocial").value;
  const direccion = document.getElementById("direccion").value;
  const ciudad = document.getElementById("ciudad").value;
  const tipoCliente = document.getElementById("tipoCliente").value;
  const tipoOperacion = document.getElementById("tipoOperacion").value;

  // Fecha de intervención (actual)
  const fechaIntervencion = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  // Próxima fecha de intervención (ejemplo, 30 días después)
  const proximaIntervencion = new Date();
  proximaIntervencion.setDate(proximaIntervencion.getDate() + 1461);
  const proximaFecha = proximaIntervencion.toISOString().split("T")[0]; // Formato YYYY-MM-DD

  // Usuario de la computadora (aquí se puede agregar el nombre del usuario si se obtiene de alguna fuente)
  const usuario = "UsuarioEjemplo"; // Puedes modificar esto para obtener el nombre del usuario

  // Crear una nueva fila con los datos
  const nuevaFila = document.createElement("tr");

  nuevaFila.innerHTML = `
    <td>${nCliente}</td>
    <td>${razonSocial}</td>
    <td>${tipoCliente}</td>
    <td>${tipoOperacion}</td>
    <td>${fechaIntervencion}</td>
    <td>${proximaFecha}</td>
    <td>${usuario}</td>
    <td>
      <button class="edit-btn" onclick="editarFila(this)">Editar</button>
      <button class="delete-btn" onclick="eliminarFila(this)">Eliminar</button>
    </td>
  `;

  // Agregar la fila a la tabla
  document.querySelector("#tablaDatos tbody").appendChild(nuevaFila);

  // Limpiar el formulario después de guardar
  document.getElementById("formulario").reset();
}

function editarFila(btn) {
  const fila = btn.closest("tr");
  const celdas = fila.getElementsByTagName("td");

  // Rellenar el formulario con los datos de la fila
  document.getElementById("nCliente").value = celdas[0].textContent;
  document.getElementById("razonSocial").value = celdas[1].textContent;
  document.getElementById("tipoCliente").value = celdas[2].textContent;
  document.getElementById("tipoOperacion").value = celdas[3].textContent;

  // Cambiar el estado del formulario para edición
  modoEdicion = true;
  filaEditando = fila;

  // Cambiar el texto del botón de guardar
  const botonGuardar = document.querySelector("form button");
  botonGuardar.textContent = "Actualizar Datos";
}

function eliminarFila(btn) {
  const fila = btn.closest("tr");
  fila.remove();
}

function mostrarCamposOperacion() {
  const tipoOperacion = document.getElementById("tipoOperacion").value;
  const camposCalibracion = document.getElementById("calibracionCampos");
  const camposCambioEquipo = document.getElementById("cambioEquipoCampos");

  // Mostrar u ocultar los campos dependiendo de la operación seleccionada
  if (tipoOperacion === "Calibracion") {
    camposCalibracion.style.display = "block";
    camposCambioEquipo.style.display = "none";
  } else if (tipoOperacion === "CambioEquipo") {
    camposCambioEquipo.style.display = "block";
    camposCalibracion.style.display = "none";
  }
}

function searchTable() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toUpperCase();
  const table = document.getElementById("tablaDatos");
  const rows = table.getElementsByTagName("tr");

  // Iterar sobre las filas de la tabla y ocultar las que no coinciden con el filtro
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let match = false;

    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      if (cell) {
        const text = cell.textContent || cell.innerText;
        if (text.toUpperCase().indexOf(filter) > -1) {
          match = true;
        }
      }
    }

    if (match) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}

function exportToExcel() {
  const table = document.getElementById("tablaDatos");
  const rows = table.getElementsByTagName("tr");
  const data = [];

  // Iterar sobre las filas de la tabla y agregar los datos a la variable "data"
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowData = [];
    const cells = row.getElementsByTagName("td");

    for (let j = 0; j < cells.length; j++) {
      rowData.push(cells[j].textContent);
    }

    data.push(rowData);
  }

  // Crear un archivo Excel a partir de los datos
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Intervenciones");

  // Descargar el archivo Excel
  XLSX.writeFile(wb, "intervenciones.xlsx");
}



