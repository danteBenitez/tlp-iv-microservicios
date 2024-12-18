import { AlertTriangle, Package, Truck } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchShipments,
  IShipment,
  SHIPMENT_STATUS,
} from "../store/slices/shipmentSlice";
import { AppDispatch, RootState } from "../store/store";
import { Mantenimiento } from "./components/Mantenimiento";
import "./estadoEnvio.css";

const text = {
  [SHIPMENT_STATUS.DELIVERED]: "Entregado",
  [SHIPMENT_STATUS.IN_STOCK]: "Pendiente",
  [SHIPMENT_STATUS.TRAVELING]: "En tránsito",
};

const EstadoEnvio: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const { shipments, loading, error } = useSelector(
    (state: RootState) => state.shippings
  );
  const socket = useSelector((state: RootState) => state.socket.socket);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch, token]);

  useEffect(() => {
    if (!socket) return;
    console.log("Seteando manejador de evento");
    socket?.on("shipment-status-changed", (shipment: IShipment) => {
      console.log("Estado de envío cambiado");
      if (shipment.userId == user?.userId) {
        dispatch(fetchShipments());
      }
    });
  });

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <Mantenimiento />;
  }

  if (shipments.length === 0) {
    return <p>No tienes envíos activos.</p>;
  }

  return (
    <div className="estado-envio-container">
      {shipments.map((s) => (
        <ShipmentItem shipment={s} />
      ))}
    </div>
  );
};

export function ShipmentItem({ shipment }: { shipment: IShipment }) {
  // Determinar qué ícono mostrar basado en el estado
  const obtenerIcono = () => {
    switch (shipment.status) {
      case SHIPMENT_STATUS.DELIVERED:
        return (
          <Package className="estado-envio-icono" color="#28a745" size={48} />
        );
      case SHIPMENT_STATUS.TRAVELING:
        return (
          <Truck className="estado-envio-icono" color="#ffc107" size={48} />
        ); // Ícono para en tránsito
      case SHIPMENT_STATUS.IN_STOCK:
        return (
          <AlertTriangle
            className="estado-envio-icono"
            color="#dc3545"
            size={48}
          />
        ); // Ícono para pendiente
      default:
        return null;
    }
  };

  return (
    <div key={shipment.shipmentId} className="estado-envio">
      <h2 className="estado-envio-titulo">Estado de Envío</h2>
      <p className="estado-envio-subtitulo">{shipment.address}</p>
      <div>
        <Link
          className="estado-envio-subtitulo"
          to={`/admin/sales/${shipment.saleId}`}
        >
          Ver venta
        </Link>
      </div>
      {obtenerIcono()}
      <button className="estado-envio-boton">{text[shipment.status]}</button>
    </div>
  );
}

export default EstadoEnvio;
