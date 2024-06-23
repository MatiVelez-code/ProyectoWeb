//menu desplegable
"use strict";
document.querySelector(".boton-navegacion").addEventListener("click",mostrarMenu);
function mostrarMenu() {
    document.querySelector("nav").classList.toggle("mostrar");
}
//modo oscuro 

cagardarkmodedesdelocalstorage()    
document.getElementById("slider").addEventListener("click",cambiarModo);

// preferencia del usuario segun tema de windowns 
let preferedColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? cambiarModo : 'light';


function cambiarModo() {
    document.querySelector('header').classList.toggle("dark-mode");
    document.querySelector('body').classList.toggle("dark-mode");
    document.querySelector('nav').classList.toggle('dark-mode');
    document.querySelector('footer').classList.toggle('dark-mode');
    guardardarkmodeEnElLocalStore(document.body.classList.contains('dark-mode'))    
}
function guardardarkmodeEnElLocalStore (estado){
    localStorage.setItem('dark-mode', estado)
}
function cagardarkmodedesdelocalstorage(){
    let darkmodeguardado = localStorage.getItem('dark-mode') === 'true';
    if (darkmodeguardado){
        document.querySelector('header').classList.add("dark-mode");
        document.querySelector('body').classList.add("dark-mode");
        document.querySelector('nav').classList.add('dark-mode');
        document.querySelector('footer').classList.add('dark-mode');
    }
}

// parcial rest

let enlaces = document.querySelectorAll('.a-actualizar');


enlaces.forEach(enlace => enlace.addEventListener('click', function (e) {
    actualizar(e, enlace)
}));

setTimeout(() => {             //simulo click en inicio     
    enlaces[0].click();
}, 1);

function actualizar(e, enlace) {
    e.preventDefault();

    document.getElementById('actualizar').innerHTML = "<p>Cargando...</p>";

    let href = enlace.getAttribute('href');

    fetch(href)
        .then(response => response.text())
        .then(text => {
            document.getElementById('actualizar').innerHTML = text;
            if (href == "html/contacto.html") //si carga el formulario cargo script formulario
              form();
            else if (href == "html/calendario.html")
              tablaDinamica ();
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('actualizar').innerHTML = "<p>Error al cargar el contenido.</p>";
        });
};

// funcion del formulario 
function form (){
    let form = document.querySelector('#form');
    form.addEventListener('submit', Formulario);

    function Formulario(e) {
    e.preventDefault();
    console.log('entré a la funcion');
    let resultado = document.querySelector("#resultado").value;
            if (resultado != resultadoCorrecto) {
                e.preventDefault();
                document.querySelector("#captchaIncorrecto").innerHTML ="Respuesta Incorrecta. Probá de nuevo o actualiza el captcha";
                
            }
            else{
                e.preventDefault();
                document.querySelector("#captchaIncorrecto").innerHTML ="Correcto!! Tus datos fueron enviados";
    }
    }

    //captcha
    document.querySelector("#botonCaptcha").addEventListener("click", generarCaptcha);
    let resultadoCorrecto;
    generarCaptcha();

    function generarCaptcha() {
        let captcha1 = Math.random().toString(36).substring(2,12);
        resultadoCorrecto =  captcha1;
        captcha1= captcha1.toUpperCase()
        document.querySelector("#captcha").innerHTML =   captcha1;
        document.querySelector("#resultado").value ="";
        document.querySelector("#captchaIncorrecto").innerHTML ="";
    
    }

}
// tabla dinamica
function tablaDinamica (){

    const BASE_URL = "https://6675a9f9a8d2b4d072f0fcce.mockapi.io/tabla";
    const limit = 5;
    obtener()

    let currentPage = 1;


    document.getElementById("btn-anterior").addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            obtener(currentPage, limit);
            
        }
    });

    document.getElementById("btn-siguiente").addEventListener("click", function () {
        if (currentPage < limit) {
            currentPage++;
            obtener(currentPage, limit);
        }
    });


    async function obtener(page = 1, limit = 5) {
        try {
            let url = new URL(BASE_URL);
            url.searchParams.append('page', page);
            url.searchParams.append('limit', limit);
            let response = await fetch(url);
            if (!response.ok) {
                throw new Error('Connection error');
            }
            let torneos = await response.json();
            mostrar(torneos);
            buscar (torneos);
        } catch (e) {
            console.log(e);
        }
    }
    //mostrar tabla 

    function mostrar(torneos) {
        let tabla = document.getElementById("tbody");
        
        tabla.innerHTML = ''; // Limpiar el contenido anterior de la tabla
        
        torneos.forEach(torneos => {
            let tr = document.createElement('tr');
            tr.id = "torneos-" + torneos.id; // Asignar un id a la fila
            
            let tdFecha = document.createElement('td');
            tdFecha.textContent = torneos.fecha;
            tr.appendChild(tdFecha);
            
            let tdTorneo = document.createElement('td');
            tdTorneo.textContent = torneos.torneo;
            tr.appendChild(tdTorneo);
            
            let tdLugar = document.createElement('td');
            tdLugar.textContent = torneos.lugar;
            tr.appendChild(tdLugar);

            let tdBorrarEditar = document.createElement('td');

            let editar = document.createElement('button');
            editar.textContent = "editar";
            editar.id = 'btn-editar';
            editar.addEventListener('click', () => editarTorneo(torneos.id));

            let eliminar = document.createElement('button');
            eliminar.textContent = "eliminar";
            eliminar.id = 'btn-eliminar';
            eliminar.addEventListener('click', () => eliminarTorneo(torneos.id));

            tdBorrarEditar.appendChild(editar);
            tdBorrarEditar.appendChild(eliminar);
            tr.appendChild(tdBorrarEditar).classList.add ("btn-editar-borrar");


            tbody.appendChild(tr)
        });
    }

    function eliminarTorneo(id) {
        fetch(BASE_URL + '/' + id, {
            method: 'DELETE',
        }).then(response => {
            if (response.ok) {
                obtener(); // Actualizar la lista después de eliminar
            } else {
                throw new Error('Error al eliminar el torneo');
            }
        })
            .catch(error => {
                console.error('Error:', error);
            })
    };
    function editarTorneo(id) {

        fetch(BASE_URL + '/' + id)  // Obtener el torneo a editar
            .then(response => response.json())
            .then(torneos => {
                let tr = document.querySelector("#torneos-" + id);
                tr.innerHTML = ''; // Limpiar la fila para agregar los inputs de edición

                let tdFecha = document.createElement('td');
                let inputFecha = document.createElement('input');
                inputFecha.type = 'text.month';
                inputFecha.value = torneos.fecha;
                tdFecha.appendChild(inputFecha);
                tr.appendChild(tdFecha);

                let tdTorneo = document.createElement('td');
                let inputTorneo = document.createElement('input');
                inputTorneo.type = 'text';
                inputTorneo.value = torneos.torneo;
                tdTorneo.appendChild(inputTorneo);
                tr.appendChild(tdTorneo);

                let tdLugar = document.createElement('td');
                let inputLugar = document.createElement('input');
                inputLugar.type = 'text';
                inputLugar.value = torneos.lugar;
                tdLugar.appendChild(inputLugar);
                tr.appendChild(tdLugar);

                let tdBorrarEditar = document.createElement('td');
                let guardar = document.createElement('button');
                guardar.textContent = "Guardar";
                guardar.id = 'btn-guardar';
                guardar.addEventListener('click', () => guardarCambios(id, inputFecha.value, inputTorneo.value, inputLugar.value));
                tdBorrarEditar.appendChild(guardar);
                tr.appendChild(tdBorrarEditar);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function guardarCambios(id, fecha, torneo, lugar) {
        let torneoActualizado = {
            fecha,
            torneo,
            lugar,
        
        };

        fetch(BASE_URL + '/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(torneoActualizado)
        }).then(response => {
            if (response.ok) {
                obtener(); // Actualizar la lista después de guardar los cambios
            } else {
                throw new Error('Error al guardar los cambios');
            }
        })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    document.getElementById('btn-agregar').addEventListener('click', agregar);

    function agregar() {
        
        let tr = document.createElement('tr');
        
        let tdFecha = document.createElement('td');
        let inputFecha = document.createElement('input');
        inputFecha.type = 'text';
        inputFecha.setAttribute("id", "fecha");
        tdFecha.appendChild(inputFecha);
        tr.appendChild(tdFecha);
        
        let tdTorneo = document.createElement('td');
        let inputTorneo = document.createElement('input');
        inputTorneo.type = 'text';
        inputTorneo.setAttribute ("id" , "torneo");
        tdTorneo.appendChild(inputTorneo);
        tr.appendChild(tdTorneo);
        
        
        let tdLugar = document.createElement('td');
        let inputLugar = document.createElement('input');
        inputLugar.type = 'text';
        inputLugar.setAttribute( "id" , "lugar");
        tdLugar.appendChild(inputLugar);
        tr.appendChild(tdLugar);
    
        let tdIngresar = document.createElement('td');
        let ingresar = document.createElement('button');
        let ingresarVarios = document.createElement ('button')
        ingresarVarios.textContent = 'ingresar 3'
        ingresar.textContent = "Ingresar";
    
        ingresarVarios.addEventListener ('click', () => pushear(3))
        ingresar.addEventListener('click', () => pushear(1));
        
        tdIngresar.appendChild(ingresar);
        tdIngresar.appendChild(ingresarVarios);
        tr.appendChild(tdIngresar);
            
        tbody.appendChild(tr)
        }
        
        
    function pushear (n){
        let lugar = document.getElementById ('lugar').value;
        let torneo = document.getElementById ('torneo').value;
        let fecha = document.getElementById ('fecha').value;
        
        let torneos = {
            fecha: fecha,
            torneo: torneo,
            lugar: lugar,
        
        }
        for (let i = 0; i < n; i++){
            
            fetch(BASE_URL, {
                method: 'POST',
        
                headers: {
                    "content-Type": 'application/json'
                },
                body: JSON.stringify(torneos),
            })
            .then(response => {
                if (response.ok) {
                    obtener(); // Actualizar la lista después de agregar
                } else {
                    throw new Error('Error al agregar el torneo');
                }
            })
                .catch(error => {
                    console.error('Error:', error);
        
                });
        }
    }      


    // filtrado
    let filtro = document.querySelector("#filtro")

    function buscar (torneos){
    
            filtro.addEventListener ("input", e =>{
                let inputext = e.target.value.toLowerCase().trim();
                
                let mostrarFiltrado = torneos.filter(torneos => 
                    torneos.fecha.toLowerCase().startsWith(inputext) ||
                    torneos.torneo.toLowerCase().startsWith(inputext) ||
                    torneos.lugar.toLowerCase().startsWith(inputext));
            
                    mostrar (mostrarFiltrado);
        })
            
    }
}



