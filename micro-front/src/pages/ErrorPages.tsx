import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const ErrorPage: React.FC = () => {
  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h1>404 - Página no encontrada</h1>
          <p>Lo sentimos, la página que estás buscando no existe.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorPage;