import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { showNotification } from '../../store/slices/notificationSlice';
import { useEffect } from 'react';
import { getProfile } from '../../store/slices/authSlice';

const Profile: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const userProfile = useSelector((state: RootState) => state.auth.user);
    
    useEffect(() => {
        dispatch(getProfile());
        if (userProfile) {
          dispatch(showNotification({ message: 'User profile loaded successfully', type: 'success' }));
        }
      }, [dispatch]);

    if (!userProfile) {
        return null;
    }

    return (
        <Container fluid className="profile-container">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="profile-card">
                        <Card.Header className="profile-header">
                            <h5>Perfil de Usuario</h5>
                            <div className='d-flex justify-content-end'>
                                <div className='text-center'>
                                <Card.Subtitle className="mb-2 text-muted">Miembro desde:</Card.Subtitle>
                                <Card.Subtitle className="mb-2 text-muted">{userProfile?.createdAt}</Card.Subtitle>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="text-center">
                            <img
                                src="https://via.placeholder.com/150"
                                alt="Avatar"
                                className="profile-avatar"
                            />
                            <Card.Title>{userProfile?.username}</Card.Title>
                            <Card.Subtitle className="m-2 text-muted">{userProfile?.username}</Card.Subtitle>
                            <Button variant="primary" className="mb-3">Editar Perfil</Button>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="profile-list-group-item"><strong>Email:</strong> {userProfile?.email}</ListGroup.Item>
                                {/* <ListGroup.Item className="profile-list-group-item"><strong>DNI:</strong> {userProfile?.dni}</ListGroup.Item>
                                <ListGroup.Item className="profile-list-group-item"><strong>Teléfono:</strong> {userProfile?.phone}</ListGroup.Item>
                                <ListGroup.Item className="profile-list-group-item"><strong>Dirección:</strong> {userProfile?.address}</ListGroup.Item>
                                <ListGroup.Item className="profile-list-group-item"><strong>Ciudad:</strong> {userProfile?.city}</ListGroup.Item>
                                */}
                                <ListGroup.Item className="profile-list-group-item"><strong>Rol:</strong> {userProfile?.roles && userProfile.roles.length > 0 && userProfile.roles[0].name}</ListGroup.Item> 
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;