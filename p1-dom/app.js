// 1. Modelo de Pedido como Objeto / Clase
class Pedido {
  constructor(id, producto, precio, cantidad) {
    this.id = id;
    this.producto = producto;
    this.precio = parseFloat(precio);
    this.cantidad = parseInt(cantidad);
    this.estado = 'pendiente'; // 'pendiente' o 'entregado'
  }

  subtotal() {
    return this.precio * this.cantidad;
  }

  marcarEntregado() {
    this.estado = 'entregado';
  }
}

// 2. Arreglo global para almacenar los pedidos
let pedidos = [];

// Seleccionar elementos del DOM
const formPedido = document.getElementById('form-pedido');
const inputProducto = document.getElementById('producto');
const inputPrecio = document.getElementById('precio');
const inputCantidad = document.getElementById('cantidad');
const mensajeP = document.getElementById('mensaje');
const selectFiltro = document.getElementById('filtro');
const listaPedidos = document.getElementById('lista-pedidos');
const totalP = document.getElementById('total');

// 3. Función de renderizado seguro (Evita XSS usando textContent / createElement)
function render() {
  listaPedidos.innerHTML = ''; // Limpiamos la lista visual

  const filtroActual = selectFiltro.value;

  // Filtrar pedidos según el select
  const pedidosFiltrados = pedidos.filter(p => {
    if (filtroActual === 'pendiente') return p.estado === 'pendiente';
    if (filtroActual === 'entregado') return p.estado === 'entregado';
    return true; // 'todos'
  });

  let acumuladoTotal = 0;

  pedidosFiltrados.forEach(p => {
    const li = document.createElement('li');
    
    // Usamos textContent de forma segura contra XSS
    li.textContent = `${p.producto} - S/ ${p.precio.toFixed(2)} x ${p.cantidad} = S/ ${p.subtotal().toFixed(2)} [${p.estado}] `;

    // Botón para marcar como entregado
    if (p.estado === 'pendiente') {
      const btnEntregar = document.createElement('button');
      btnEntregar.textContent = 'Entregar';
      btnEntregar.dataset.id = p.id;
      btnEntregar.classList.add('btn-entregar');
      li.appendChild(btnEntregar);
    }

    // Botón para eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.dataset.id = p.id;
    btnEliminar.classList.add('btn-eliminar');
    li.appendChild(btnEliminar);

    listaPedidos.appendChild(li);

    // Sumar al total general solo si no está cancelado/eliminado
    acumuladoTotal += p.subtotal();
  });

  totalP.textContent = `Total a cobrar: S/ ${acumuladoTotal.toFixed(2)}`;
}

// 4. Manejo del Submit con preventDefault y validaciones estrictas (sin alert)
formPedido.addEventListener('submit', (e) => {
  e.preventDefault();
  mensajeP.textContent = '';

  const producto = inputProducto.value.trim();
  const precio = parseFloat(inputPrecio.value);
  const cantidad = parseInt(inputCantidad.value);

  // Validaciones
  if (!producto) {
    mensajeP.textContent = 'Error: El campo producto no puede estar vacío.';
    return;
  }
  if (isNaN(precio) || precio <= 0) {
    mensajeP.textContent = 'Error: El precio debe ser mayor a 0.';
    return;
  }
  if (isNaN(cantidad) || cantidad <= 0) {
    mensajeP.textContent = 'Error: La cantidad debe ser un número positivo mayor o igual a 1.';
    return;
  }

  // Crear nuevo objeto pedido
  const nuevoPedido = new Pedido(Date.now(), producto, precio, cantidad);
  pedidos.push(nuevoPedido);

  // Limpiar formulario y actualizar vista
  formPedido.reset();
  render();
});

// 5. Delegación de Eventos en #lista-pedidos (Un solo listener para Entregar y Eliminar)
listaPedidos.addEventListener('click', (e) => {
  const boton = e.target.closest('button');
  if (!boton) return;

  const id = Number(boton.dataset.id);

  if (boton.classList.contains('btn-entregar')) {
    const pedido = pedidos.find(p => p.id === id);
    if (pedido) {
      pedido.marcarEntregado();
      render();
    }
  }

  if (boton.classList.contains('btn-eliminar')) {
    pedidos = pedidos.filter(p => p.id !== id);
    render();
  }
});

// 6. Evento change para el filtro
selectFiltro.addEventListener('change', () => {
  render();
});