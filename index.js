document.addEventListener('DOMContentLoaded', () => {
  const formularioNombre = document.getElementById('formularioNombre');
  const formularioMonto = document.getElementById('formularioMonto');
  const mensajeBienvenida = document.getElementById('mensajeBienvenida');
  const nombreCompletoSpan = document.getElementById('nombreCompleto');
  const tarjetasContainer = document.getElementById('tarjetas');
  const formularioCuotas = document.getElementById('formularioCuotas');
  const contenedorCuotas = document.getElementById('contenedorCuotas');
  const cuotaMensual = document.getElementById('cuotaMensual');
  const resultadoContainer = document.getElementById('resultado');
  const mensajeError = document.getElementById('mensajeError');

  let datosUsuario = {};
  let datosMonto = {};
  let tarjetas = [];
  let tarjetaElegida = {};

  formularioNombre.addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;

    Swal.fire({
      title: 'Confirmar Nombre y Apellido',
      text: `¿Es correcto el nombre: ${nombre} ${apellido}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        datosUsuario = { nombre, apellido };
        mostrarMensajeBienvenida();
      }
    });
  });

  formularioMonto.addEventListener('submit', (event) => {
    event.preventDefault();
    const monto = parseFloat(document.getElementById('monto').value);

    Swal.fire({
      title: 'Confirmar Monto a Financiar',
      text: `¿Es correcto el monto: $${monto.toFixed(2)}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        datosMonto = { monto };
        mostrarTarjetas();
      } else {
        formularioMonto.classList.remove('oculto'); 
      }
    });
  });


  function cargarDatosTarjetas() {
    fetch('assets/datosTarjetas.json')
      .then(response => response.json())
      .then(data => {
        tarjetas = data.tarjetas;
        mostrarTarjetas();
      });
  }



  
    function mostrarMensajeBienvenida() {
      nombreCompletoSpan.textContent = datosUsuario.nombre + ' ' + datosUsuario.apellido;
      mensajeBienvenida.classList.remove('oculto');
      formularioNombre.classList.add('oculto');
      formularioMonto.classList.remove('oculto');
    }
  
    formularioMonto.addEventListener('submit', (event) => {
      event.preventDefault();
      const monto = parseFloat(document.getElementById('monto').value);
      datosMonto = { monto };
      localStorage.setItem('datosMonto', JSON.stringify(datosMonto));
      mostrarTarjetas();
    });
  
  function mostrarTarjetas() {
      formularioMonto.classList.add('oculto');
      tarjetasContainer.classList.remove('oculto');
      formularioCuotas.classList.remove('oculto');
  
      tarjetasContainer.innerHTML = '';
  
      tarjetas.forEach(tarjeta => {
        const tarjetaElemento = document.createElement('div');
        tarjetaElemento.classList.add('tarjeta');
        tarjetaElemento.setAttribute('data-tarjeta', tarjeta.nombre);
        tarjetaElemento.setAttribute('data-interes', tarjeta.interes);
        tarjetaElemento.setAttribute('data-cuotas', tarjeta.cuotas.join(','));
  
        tarjetaElemento.innerHTML = `
          <h3>${tarjeta.nombre}</h3>
          <p>Interés: ${tarjeta.interes}%</p>
        `;
  
        tarjetasContainer.appendChild(tarjetaElemento);
  
        tarjetaElemento.addEventListener('click', () => {
          tarjetaElegida = {
            tarjeta: tarjeta.nombre,
            interes: parseFloat(tarjeta.interes),
            cuotas: tarjeta.cuotas,
          };
          mostrarFormularioCuotas();
        });
      });
    }

    
    function mostrarFormularioCuotas() {
      tarjetasContainer.classList.add('oculto');
      contenedorCuotas.innerHTML = '';
  
      tarjetaElegida.cuotas.forEach(cuota => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'cuotas';
        input.value = cuota;
        label.textContent = cuota + ' cuotas';
        contenedorCuotas.appendChild(input);
        contenedorCuotas.appendChild(label);
      });
  
      const botonCalcular = document.createElement('button');
      botonCalcular.type = 'submit';
      botonCalcular.textContent = 'Calcular';
      contenedorCuotas.appendChild(botonCalcular);
  
      formularioCuotas.classList.add('oculto');
      formularioCuotas.classList.remove('oculto');
      const botonSubmitFormularioCuotas = formularioCuotas.querySelector('button[type="submit"]');
      botonSubmitFormularioCuotas.addEventListener('click', calcularCuotaMensual);
    }
  
    function calcularCuotaMensual(event) {
      event.preventDefault();
      const inputCuotasSeleccionada = document.querySelector('input[name="cuotas"]:checked');
    
      if (inputCuotasSeleccionada) {
        const cuotasSeleccionada = parseInt(inputCuotasSeleccionada.value);
        const monto = datosMonto.monto;
        const interes = tarjetaElegida.interes;
        const cuotas = cuotasSeleccionada;
        const cuotaMensualCalculada = (monto * (1 + interes / 100)) / cuotas;
        cuotaMensual.textContent = '$' + cuotaMensualCalculada.toFixed(2) + ' por mes';
        resultadoContainer.classList.remove('oculto');
        mensajeError.classList.add('oculto'); 
      } else {
        
        mensajeError.classList.remove('oculto');
        resultadoContainer.classList.remove('oculto');
        cuotaMensual.textContent = ''; 
      }
    }
    cargarDatosTarjetas();
  
  });
  