import React, { useState } from 'react';
import { ShoppingCart, Check, Trash2 } from 'lucide-react';
import CarritoCompras from './carritoCompras';
import './all_list_products.css';

type Product = {
  id: number;
  name: string;
  qty: number;
  price: number;
  user: string;
  imageUrl: string;
};

const products: Product[] = [
  { id: 1, name: 'Camiseta', qty: 4, price: 19.99, user: 'Juan', imageUrl: '../../src/assets/img/reactlogo.png' },
  { id: 2, name: 'Pantalón', qty: 5, price: 39.99, user: 'María', imageUrl: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Zapatilla', qty: 3, price: 99.99, user: 'Jesus', imageUrl: 'https://via.placeholder.com/150' },
];

const AllListProducts: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [productList, setProductList] = useState<Product[]>(products);
  const [showModal, setShowModal] = useState(false);

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
      setProductList((prevList) => prevList.filter((product) => product.id !== productId));
      setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
    }
  };

  const handlePurchase = () => {
    if (selectedProducts.length === 0) {
      alert('Debe seleccionar al menos un producto.');
    } else {
      setShowModal(true);
    }
  };

  const selectedProductDetails = productList.filter((product) =>
    selectedProducts.includes(product.id)
  );

  return (
    <div className="all_products_carrito_container">
      <div className="product-page">
        <h1 className="title">Mi Tienda de Productos</h1>

        <div className="cart">
          <h2 className="cart-title">
            <ShoppingCart className="cart-icon" size={24} /> Carrito
          </h2>
          <p>Productos en el carrito: {selectedProducts.length}</p>
          <p>Total seleccionado: ${totalPrice.toFixed(2)}</p>
          <button className="purchase-button" onClick={handlePurchase}>
            <Check className="check-icon" size={20} /> Comprar seleccionados
          </button>
        </div>

        <div className="product-list">
          {productList.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.imageUrl} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p className="product-qty">Cantidad: {product.qty}</p>
              <p className="product-user">Usuario: {product.user}</p>
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CarritoCompras onClose={() => setShowModal(false)} productos={selectedProductDetails} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllListProducts;
