import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import './CarritoCompras.css';

interface Producto {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface CarritoComprasProps {
  onClose: () => void;
  productos: Producto[];
}

const CarritoCompras: React.FC<CarritoComprasProps> = ({ onClose, productos }) => {
  const [productosCarrito, setProductosCarrito] = useState<Producto[]>(productos);

  const actualizarCantidad = (id: number, incremento: number) => {
    setProductosCarrito((prevProductos) =>
      prevProductos.map((producto) =>
        producto.id === id
          ? { ...producto, qty: Math.max(1, producto.qty + incremento) }
          : producto
      )
    );
  };

  const eliminarProducto = (id: number) => {
    setProductosCarrito((prevProductos) => prevProductos.filter((producto) => producto.id !== id));
  };

  const total = productosCarrito.reduce((acc, producto) => acc + producto.price * producto.qty, 0);

  return (
    <div className="carrito-container">
      <div className="carrito-compras">
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className="carrito-titulo">
          <span role="img" aria-label="shopping-cart" className="icono-carrito">🛒</span>
          Carrito de Compras
        </h2>
        
        {productosCarrito.map((producto) => (
          <div key={producto.id} className="producto">
            <span className="producto-nombre">{producto.name} - ${producto.price}</span>
            <div className="cantidad-control">
              <button onClick={() => actualizarCantidad(producto.id, -1)} className="boton-cantidad-menos">-</button>
              <input type="text" value={producto.qty} readOnly className="input-cantidad" />
              <button onClick={() => actualizarCantidad(producto.id, 1)} className="boton-cantidad-mas">+</button>
            </div>
            <Trash2 onClick={() => eliminarProducto(producto.id)} size={30} className="boton-eliminar" />
          </div>
        ))}
        
        <h3 className="total">Total: ${total.toFixed(2)}</h3>
        <button className="boton-comprar">Comprar Todo</button>
      </div>
    </div>
  );
};

export default CarritoCompras;
