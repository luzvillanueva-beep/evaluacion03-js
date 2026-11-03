const IGV = 0.18;

export class Pedido {
  constructor({ id, producto, precio, cantidad = 1, cliente = null }) {
    this.id = id;
    this.producto = producto;
    this.precio = precio;
    this.cantidad = cantidad; // Usa el valor por defecto si no viene definido
    this.estado = 'pendiente';
  }

  subtotal() {
    return this.precio * this.cantidad;
  }

  marcarEntregado() {
    this.estado = 'entregado';
  }
}

// Función flecha para calcular el total acumulado aplicando el IGV (18%)
export const calcularTotalConIGV = (pedidos) => {
  const subtotalGeneral = pedidos.reduce((acc, p) => {
    // Usamos el operador ?? para respetar cantidades en 0 si las hubiera
    const cant = p.cantidad ?? 1;
    return acc + (p.precio * cant);
  }, 0);

  return subtotalGeneral + (subtotalGeneral * IGV);
};

// Función para el resumen del pedido usando encadenamiento opcional (?.)
export const resumenPedido = (pedido) => {
  const clienteNombre = pedido.cliente?.nombre ?? "Anónimo";
  return `Pedido de ${clienteNombre}: ${pedido.producto} x${pedido.cantidad}`;
};