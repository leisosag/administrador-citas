// CAMPOS DEL FORM
const mascotaInput = document.getElementById('mascota');
const propietarioInput = document.getElementById('propietario');
const telefonoInput = document.getElementById('telefono');
const fechaInput = document.getElementById('fecha');
const horaInput = document.getElementById('hora');
const sintomasInput = document.getElementById('sintomas');

// UI
const formulario = document.getElementById('nueva-cita');
const contenedorCitas = document.getElementById('citas');

let editando;

// CLASE CITAS
class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }
}
// CLASE UI
class UI {
    imprimirAlerta(mensaje, tipo) {
        // creo el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        // agrega clase en base al tipo de error
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        // mensaje
        divMensaje.textContent = mensaje;
        // agrego al DOM
        document.getElementById('contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
        // quita la alerta
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    // muestra las citas
    imprimirCitas({ citas }) {
        this.limpiarHTML();

        citas.forEach(cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
            <span class="font-weight-bolder">Propietario: </span>${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
            <span class="font-weight-bolder">Teléfono: </span>${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
            <span class="font-weight-bolder">Fecha: </span>${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
            <span class="font-weight-bolder">Hora: </span>${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
            <span class="font-weight-bolder">Síntomas: </span>${sintomas}
            `;

            // boton para eliminar la cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Eliminar';
            btnEliminar.onclick = () => eliminarCita(id);

            // boton para editar una cita
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> Editar';
            btnEditar.onclick = () => cargarEdicion(cita);

            // agrega los parrafos al div
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // agrega las citas al HTML
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}
// intanciar clases
const ui = new UI();
const administrarCitas = new Citas();

// REGISTRA EVENT LISTENERS
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);
    formulario.addEventListener('submit', nuevaCita);
}

// OBJETO CON LA INFORMACION DE LA CITA
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// va llenando el objeto con lo que escribe el usuario
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

// valida y agrega una nueva cita a la clase de citas
function nuevaCita(e) {
    e.preventDefault();
    // extraer la info del objeto cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // validar 
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligarios', 'error');
        return;
    }

    if (editando) {
        // mensaje de editado
        ui.imprimirAlerta('Se editó correctamente');

        // pasar el objeto de la cita a edicion
        administrarCitas.editarCita({ ...citaObj });

        // regresa el texto del submit a texto original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        // quita modo edicion
        editando = false;
    } else {
        // generar un id unico
        citaObj.id = Date.now();

        //crear cita
        // se le pasa una copia, en vez de la referencia completa, asi no se sobreescribe a la anterior
        administrarCitas.agregarCita({ ...citaObj });

        // mensaje de agregado
        ui.imprimirAlerta('Se agregó correctamente');
    }



    // reinicia el formulario despues de hacer submit y el objeto
    reiniciarObjeto();
    formulario.reset();

    // mostrar el HTML
    ui.imprimirCitas(administrarCitas);
}

// reinicia el objeto
function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

// borrar una cita
function eliminarCita(id) {
    // eliminar cita
    administrarCitas.eliminarCita(id);
    // muestra un mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente');
    // refrescar las citas
    ui.imprimirCitas(administrarCitas);
}

// carga los datos y el modo edicion
function cargarEdicion(cita) {
    // extraer la info del objeto cita
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // llena los input
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    editando = true;
}