import { Container } from "react-bootstrap";
import EstadoEnvio from "../estadoEnvio";

export function Envios() {
  return (
    <Container>
      <h1 className="mb-3">Envíos</h1>
      <div className="d-flex flex-column gap-2"></div>
      <EstadoEnvio />
    </Container>
  );
}
