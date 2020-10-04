import Citas from './classes/Citas.js';
import UI from './classes/UI.js';

import {
    mascotaInput,
    propietarioInput,
    telefonoInput,
    fechaInput,
    horaInput,
    sintomasInput,
    formulario
} from './selectores.js'

// instanciar classes
const ui = new UI();
const administrarCitas = new Citas();
let editando;
export let DB;

window.onload = () => {

    crearDB();
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
export function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}
// valida y agrega una nueva cita a la clase de citas
export function nuevaCita(e) {
    e.preventDefault();
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligarios', 'error');
        return;
    }

    if (editando) {
        administrarCitas.editarCita({ ...citaObj });

        // editar en indexedDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');

        objectStore.put(citaObj);
        transaction.oncomplete = () => {
            ui.imprimirAlerta('Se editó correctamente');
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
            editando = false;
        }

        transaction.onerror = () => {
            console.log('hubo un error')
        }
    } else {
        citaObj.id = Date.now();
        administrarCitas.agregarCita({ ...citaObj });
        // insertar registro en DB
        const transaction = DB.transaction(['citas'], 'readwrite');

        const objectStore = transaction.objectStore('citas');

        objectStore.add(citaObj);

        transaction.oncomplete = () => {
            ui.imprimirAlerta('Se agregó correctamente');
        }
    }

    reiniciarObjeto();
    formulario.reset();
    ui.imprimirCitas();
}

// reinicia el objeto
export function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

// borrar una cita
export function eliminarCita(id) {
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');
    objectStore.delete(id);

    transaction.oncomplete = () => {
        console.log(`cita ${id} eliminada`)// refrescar las citas
        ui.imprimirCitas();
        // muestra un mensaje
        ui.imprimirAlerta('La cita se eliminó correctamente');
    }

    transaction.onerror = () => {
        console.log('hubo un error')
    }
}

// carga los datos y el modo edicion
export function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    editando = true;
}

function crearDB() {
    const crearDB = window.indexedDB.open('citas', 1);

    crearDB.onerror = function () {
        console.log('hubo un error')
    }
    crearDB.onsuccess = function () {
        DB = crearDB.result;
        ui.imprimirCitas()
    }

    // definir schema
    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;
        const objectStore = db.createObjectStore('citas', {
            keyPath: 'id',
            autoIncrement: true
        });

        // defino columnas
        objectStore.createIndex('mascota', 'mascota', { unique: false });
        objectStore.createIndex('propietario', 'propietario', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('hora', 'hora', { unique: false });
        objectStore.createIndex('sintomas', 'sintomas', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });

        console.log('db creada lista')
    }
}