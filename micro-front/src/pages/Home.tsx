import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import './home.css';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Container fluid className="home-container">
      <Row className="justify-content-center text-center my-5">
        <Col md={8}>
          <h1 className="display-4">Wellcome a Police Staff News</h1>
          <p className="lead">Mantente informado con las últimas noticias y actualizaciones.</p>
        </Col>
      </Row>
      <Row className="text-center justify-content-center">
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Noticias Recientes</Card.Title>
              <Card.Text>
                Mantente al día con las últimas noticias y eventos importantes.
              </Card.Text>
              <Link to='/admin'>
                <Button variant="success" >Ver Noticias</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Perfil de Usuario</Card.Title>
              <Card.Text>
                {user ? `Hola, ${user.name} ${user.lastName}` : 'Inicia sesión para ver tu perfil.'}
              </Card.Text>
              <Link to='/admin/profile'>
                <Button variant="success">Ver Perfil</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      {/* </Row>
      <Row className="justify-content-center"> */}
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Administración</Card.Title>
              <Card.Text>
                Accede a las herramientas de administración y gestión.
              </Card.Text>
              <Link to='/admin'>
                <Button variant="success">Ir a Administración</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;