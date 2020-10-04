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
        ui.imprimirAlerta('Se editó correctamente');
        administrarCitas.editarCita({ ...citaObj });
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
        editando = false;
    } else {
        citaObj.id = Date.now();
        //crear cita
        administrarCitas.agregarCita({ ...citaObj });
        ui.imprimirAlerta('Se agregó correctamente');
    }

    reiniciarObjeto();
    formulario.reset();
    ui.imprimirCitas(administrarCitas);
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
    administrarCitas.eliminarCita(id);
    ui.imprimirAlerta('La cita se eliminó correctamente');
    ui.imprimirCitas(administrarCitas);
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