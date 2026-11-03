export function renderizarLista(pedidos, contenedor) {
  contenedor.innerHTML = '';

  pedidos.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.producto} - S/ ${p.precio.toFixed(2)} x ${p.cantidad} = S/ ${p.subtotal().toFixed(2)}`;
    contenedor.appendChild(li);
  });
}