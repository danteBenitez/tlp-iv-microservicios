import React, { useState } from 'react';
import { Package, Truck, AlertTriangle } from 'lucide-react'; // Asegúrate de importar los íconos necesarios
import './estadoEnvio.css';

const productos = [
  { id: 1, nombre: 'Producto A', estado: 'Entregado' },
  { id: 2, nombre: 'Producto B', estado: 'En tránsito' },
  { id: 3, nombre: 'Producto C', estado: 'Pendiente' },
  { id: 4, nombre: 'Producto D', estado: 'Entregado' },
  { id: 5, nombre: 'Producto E', estado: 'En tránsito' },
  { id: 6, nombre: 'Producto F', estado: 'Pendiente' },
  { id: 7, nombre: 'Producto G', estado: 'Pendiente' },
  { id: 8, nombre: 'Producto H', estado: 'Pendiente' },
  { id: 9, nombre: 'Producto E', estado: 'En tránsito' },
  { id: 10, nombre: 'Producto F', estado: 'Pendiente' },
  { id: 11, nombre: 'Producto I', estado: 'Pendiente' },
  { id: 12, nombre: 'Producto H', estado: 'Pendiente' },
  { id: 13, nombre: 'Producto H', estado: 'Pendiente' },
  { id: 14, nombre: 'Producto E', estado: 'En tránsito' },
  { id: 15, nombre: 'Producto F', estado: 'Pendiente' },
  { id: 16, nombre: 'Producto I', estado: 'Pendiente' },
  { id: 17, nombre: 'Producto H', estado: 'Pendiente' }
];

const EstadoEnvio: React.FC = () => {
  return (
    <div className="estado-envio-container">
      {productos.map((producto) => {
        const [estado, setEstado] = useState(producto.estado);

        // Función para manejar el cambio de estado
        const manejarCambio = (e: React.ChangeEvent<HTMLSelectElement>) => {
          setEstado(e.target.value);
        };

        // Determinar qué ícono mostrar basado en el estado
        const obtenerIcono = () => {
          switch (estado) {
            case 'Entregado':
              return <Package className="estado-envio-icono" color="#28a745" size={48} />;
            case 'En tránsito':
              return <Truck className="estado-envio-icono" color="#ffc107" size={48} />; // Ícono para en tránsito
            case 'Pendiente':
              return <AlertTriangle className="estado-envio-icono" color="#dc3545" size={48} />; // Ícono para pendiente
            default:
              return null;
          }
        };

        return (
          <div key={producto.id} className="estado-envio">
            <h2 className="estado-envio-titulo">Estado de Envío</h2>
            <p className="estado-envio-subtitulo">{producto.nombre}</p>
            {obtenerIcono()}
            <button className="estado-envio-boton">{estado}</button>
            <select className="estado-envio-select" value={estado} onChange={manejarCambio}>
              <option>Entregado</option>
              <option>En tránsito</option>
              <option>Pendiente</option>
            </select>
          </div>
        );
      })}
    </div>
  );
};

export default EstadoEnvio;
