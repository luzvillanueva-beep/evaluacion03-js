import { Pedido, calcularTotalConIGV } from './pedidos.js';
import { renderizarLista } from './ui.js';

let listaDePedidos = [];

const form = document.getElementById('form-pedido-p2');
const inputProducto = document.getElementById('producto-p2');
const inputPrecio = document.getElementById('precio-p2');
const inputCantidad = document.getElementById('cantidad-p2');
const mensaje = document.getElementById('mensaje-p2');
const ulPedidos = document.getElementById('lista-pedidos-p2');
const totalTexto = document.getElementById('total-p2');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  mensaje.textContent = '';

  const producto = inputProducto.value.trim();
  const precio = parseFloat(inputPrecio.value);
  const cantidadInput = inputCantidad.value;
  const cantidad = cantidadInput === '' ? 1 : parseInt(cantidadInput); // Aplica valor por defecto

  if (!producto || isNaN(precio) || precio <= 0) {
    mensaje.textContent = 'Ingrese un producto válido y un precio mayor a 0.';
    return;
  }

  // Creación del objeto usando la clase refactorizada
  const nuevoPedido = new Pedido({
    id: Date.now(),
    producto,
    precio,
    cantidad
  });

  listaDePedidos.push(nuevoPedido);

  // Renderizar interfaz y calcular total moderno
  renderizarLista(listaDePedidos, ulPedidos);
  const totalFinal = calcularTotalConIGV(listaDePedidos);
  totalTexto.innerHTML = `<strong>Total con IGV (18%): S/ ${totalFinal.toFixed(2)}</strong>`;

  form.reset();
});