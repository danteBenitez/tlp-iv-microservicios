import React from 'react';
import './all_list_products.css';

type Product = {
  id: number;
  name: string;
  price: number;
  owner: string;
  imageUrl: string;
};

const products: Product[] = [
  {
    id: 1,
    name: 'Camiseta',
    price: 19.99,
    owner: 'Juan',
    imageUrl: '../../src/assets/img/reactlogo.png'
  },
  {
    id: 2,
    name: 'Pantalón',
    price: 39.99,
    owner: 'María',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 3,
    name: 'Zapatos',
    price: 59.99,
    owner: 'Carlos',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 4,
    name: 'Pantalón',
    price: 39.99,
    owner: 'María',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 5,
    name: 'Zapatos',
    price: 59.99,
    owner: 'Carlos',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 6,
    name: 'Pantalón',
    price: 39.99,
    owner: 'María',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 7,
    name: 'Zapatos',
    price: 59.99,
    owner: 'Carlos',
    imageUrl: 'https://via.placeholder.com/150'
  }
];

const all_list_products: React.FC = () => {
  return (
    <div className="product-page">
      <h1 className="title">Mi Tienda de Productos</h1>
      <div className="filter">
        <select className="filter-select">
          <option value="">Ordenar por</option>
          <option value="price">Precio</option>
          <option value="name">Nombre</option>
        </select>
      </div>

      <div className="cart">
        <h2 className="cart-title">🛒 Carrito</h2>
        <p>Productos en el carrito: 3</p>
        <p>Total seleccionado: $0.00</p>
        <button className="purchase-button">Comprar seleccionados</button>
      </div>

      <div className="product-list">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <p className="product-owner">{product.owner}</p>
            <label>
              <input type="checkbox" /> Seleccionar para comprar
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default all_list_products;
