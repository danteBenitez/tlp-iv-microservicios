import React from 'react';
import { Package } from 'lucide-react';
import './estadoEnvio.css';

const estadoEnvio: React.FC = () => {
  return (
    <div className="estado-envio-container">

    <div className="estado-envio">
      <h2 className="estado-envio-titulo">Estado de Envío</h2>
      <p className="estado-envio-subtitulo">Producto de ejemplo</p>
      <Package className="estado-envio-icono" color="#28a745" size={48} />
      <button className="estado-envio-boton">Entregado</button>
      <select className="estado-envio-select">
        <option>Entregado</option>
        <option>En tránsito</option>
        <option>Pendiente</option>
      </select>
    </div>

    <div className="estado-envio">
      <h2 className="estado-envio-titulo">Estado de Envío</h2>
      <p className="estado-envio-subtitulo">Producto de ejemplo</p>
      <Package className="estado-envio-icono" color="#28a745" size={48} />
      <button className="estado-envio-boton">Entregado</button>
      <select className="estado-envio-select">
        <option>Entregado</option>
        <option>En tránsito</option>
        <option>Pendiente</option>
      </select>
    </div>

    <div className="estado-envio">
      <h2 className="estado-envio-titulo">Estado de Envío</h2>
      <p className="estado-envio-subtitulo">Producto de ejemplo</p>
      <Package className="estado-envio-icono" color="#28a745" size={48} />
      <button className="estado-envio-boton">Entregado</button>
      <select className="estado-envio-select">
        <option>Entregado</option>
        <option>En tránsito</option>
        <option>Pendiente</option>
      </select>
    </div>
  
    </div>
  );
};

export default estadoEnvio;
