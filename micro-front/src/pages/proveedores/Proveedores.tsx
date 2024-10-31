import { Button, Col, Container, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../store/store";
import { fetchAllSuppliers } from "../../store/slices/supplierSlice";
import React, { useEffect } from "react";
import ProveedoresCard from "./ProveedoresCard";

const ProveedoresIndex: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { suppliers, loading, error } = useSelector(
    (state: RootState) => state.suppliers
  );

  useEffect(() => {
    dispatch(fetchAllSuppliers());
  }, [dispatch]);

  if (loading) {
    return <p>Cargando proveedores...</p>;
  }

  if (error) {
    return <p>Hubo un error al cargar los proveedores</p>;
  }

  console.log({ suppliers });

  return (
    <Container className="my-5">
      <Row className="p-4 justify-content-between">
        <Col md={9}>
          <h1>Todos los Proveedores</h1>
        </Col>
        <Col md={3} className="d-flex justify-content-end">
          <Link to={''}>
            <Button
              variant="primary"
              className="d-flex align-items-center justify-content-center gap-2 p-2 fs-5"
            >
              <FaPlus></FaPlus>
              Agregar proveedor
            </Button>
          </Link>
        </Col>
      </Row>
      {suppliers.length == 0 ? <p>No hay proveedores registrados</p> : null}
      <Row>
        {suppliers &&
          suppliers.map((supplier) => <ProveedoresCard supplier={supplier} />)}
      </Row>
    </Container>
  );
}

export default ProveedoresIndex