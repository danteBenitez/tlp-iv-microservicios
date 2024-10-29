import React, { useState } from 'react';
import { Trash2 } from 'lucide-react'
import './CarritoCompras.css';


interface Producto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

const CarritoCompras: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: 'Camiseta', precio: 20, cantidad: 6 },
    { id: 2, nombre: 'Pantalón', precio: 30, cantidad: 2 },
    { id: 3, nombre: 'Zapatilla', precio: 100, cantidad: 2 },
    { id: 4, nombre: 'ojota', precio: 50, cantidad: 2 },
  ]);

  const actualizarCantidad = (id: number, incremento: number) => {
    setProductos(prevProductos =>
      prevProductos.map(producto =>
        producto.id === id
          ? { ...producto, cantidad: Math.max(1, producto.cantidad + incremento) }
          : producto
      )
    );
  };

  const eliminarProducto = (id: number) => {
    setProductos(prevProductos => prevProductos.filter(producto => producto.id !== id));
  };

  const total = productos.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);

  return (
    <div className="carrito-container">
      <div className="carrito-compras">
        <h2 className="carrito-titulo">
          <span role="img" aria-label="shopping-cart" className="icono-carrito">🛒</span> 
          Carrito de Compras
        </h2>
        {productos.map(producto => (
          <div key={producto.id} className="producto">
            <span className="producto-nombre">{producto.nombre} ${producto.precio}</span>
            <button onClick={() => actualizarCantidad(producto.id, -1)} className="boton-cantidad-menos">-</button>
            <input type="text" value={producto.cantidad} readOnly className="input-cantidad" />
            <button onClick={() => actualizarCantidad(producto.id, 1)} className="boton-cantidad-mas">+</button>
            <Trash2 onClick={() => eliminarProducto(producto.id)} size={40} className="boton-eliminar"/>
          </div>
        ))}
        <h3 className="total">Total: ${total}</h3>
        <button className="boton-comprar">Comprar Todo</button>
      </div>
    </div>
  );
};

export default CarritoCompras;
