import React, { useState } from 'react';
import { ShoppingCart, Check, Trash2 } from 'lucide-react';
import './all_list_products.css';

type Product = {
  id: number;
  name: string;
  price: number;
  owner: string;
  imageUrl: string;
};

const products: Product[] = [
  { id: 1, name: 'Camiseta', price: 19.99, owner: 'Juan', imageUrl: '../../src/assets/img/reactlogo.png' },
  { id: 2, name: 'Pantalón', price: 39.99, owner: 'María', imageUrl: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Zapatos', price: 59.99, owner: 'Carlos', imageUrl: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Pantalón', price: 39.99, owner: 'María', imageUrl: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Zapatos', price: 59.99, owner: 'Carlos', imageUrl: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Pantalón', price: 39.99, owner: 'María', imageUrl: 'https://via.placeholder.com/150' },
  { id: 7, name: 'Zapatos', price: 59.99, owner: 'Carlos', imageUrl: 'https://via.placeholder.com/150' },
];

const AllListProducts: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [productList, setProductList] = useState<Product[]>(products); // Estado para la lista de productos

  const handleCheckboxChange = (productId: number) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  const totalPrice = selectedProducts.reduce((total, productId) => {
    const product = productList.find((p) => p.id === productId);
    return total + (product ? product.price : 0);
  }, 0);

  const handleDeleteProduct = (productId: number) => {
    const confirmDelete = window.confirm('¿Estás seguro que quieres eliminar este producto?');
    if (confirmDelete) {
      // Filtrar el producto eliminado y actualizar la lista
      setProductList((prevList) => prevList.filter((product) => product.id !== productId));
      // Si el producto eliminado estaba seleccionado, eliminarlo de selectedProducts
      setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
    }
  };

  return (
    <div className="all_products_carrito_container">
      <div className="product-page">
        <h1 className="title">Mi Tienda de Productos</h1>
        <div className="filter">
          <select className="filter-select">
            <option className="opciones_productos" value="">
              Ordenar por
            </option>
            <option className="opciones_productos" value="price">
              Mayor precio
            </option>
            <option className="opciones_productos" value="name">
              Menor precio
            </option>
          </select>
        </div>

        <div className="cart">
          <h2 className="cart-title">
            <ShoppingCart className="cart-icon" size={24} /> Carrito
          </h2>
          <p>Productos en el carrito: {selectedProducts.length}</p>
          <p>Total seleccionado: ${totalPrice.toFixed(2)}</p>
          <button className="purchase-button">
            <Check className="check-icon" size={20} /> Comprar seleccionados
          </button>
        </div>

        <div className="product-list">
          {productList.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.imageUrl} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p className="product-owner">Vendedor: {product.owner}</p>
              <div className="product-actions">
                <label className="checkbox-label">
                  Seleccionar
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                  <Trash2 className="trash-icon" size={30} onClick={() => handleDeleteProduct(product.id)} />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllListProducts;
