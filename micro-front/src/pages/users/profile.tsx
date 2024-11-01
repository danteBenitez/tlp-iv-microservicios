import { useEffect } from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../store/slices/authSlice";
import { showNotification } from "../../store/slices/notificationSlice";
import { AppDispatch, RootState } from "../../store/store";
import { Ventas } from "../ventas/Ventas";

const Profile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const userProfile = useSelector((state: RootState) => state.auth.user);
  console.log("userProfile", userProfile);

  useEffect(() => {
    dispatch(getProfile());
    if (userProfile) {
      dispatch(
        showNotification({
          message: "User profile loaded successfully",
          type: "success",
        })
      );
    }
  }, [dispatch]);

  if (!userProfile) {
    return null;
  }

  return (
    <Container fluid className="profile-container">
      <Row className="justify-content-center fs-4">
        <Col md={8}>
          <Card className="profile-card">
            <Card.Header className="profile-header">
              <h1 className="display-5">Perfil de Usuario</h1>
              <div className="d-flex justify-content-end">
                <div className="text-center">
                  <Card.Subtitle className="mb-2 text-muted">
                    Miembro desde:
                  </Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date(userProfile?.createdAt).toLocaleDateString()}
                  </Card.Subtitle>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="text-center fs-3">
              <img
                src={`https://api.dicebear.com/9.x/initials/png?seed=${userProfile.username}`}
                alt="Avatar"
                className="profile-avatar rounded-circle"
              />
              <Card.Title className="fs-1">{userProfile?.username}</Card.Title>
              {/**
                     <Button variant="primary" className="mb-3 fs-4">
                        <FaPencilAlt />
                        <span className="ps-3">Editar Perfil</span>
                    </Button>
                 */}
              <ListGroup variant="flush">
                <ListGroup.Item className="profile-list-group-item">
                  <strong>Email:</strong> {userProfile?.email}
                </ListGroup.Item>
                {/* <ListGroup.Item className="profile-list-group-item"><strong>DNI:</strong> {userProfile?.dni}</ListGroup.Item>
                                <ListGroup.Item className="profile-list-group-item"><strong>Teléfono:</strong> {userProfile?.phone}</ListGroup.Item>
                                <ListGroup.Item className="profile-list-group-item"><strong>Dirección:</strong> {userProfile?.address}</ListGroup.Item>
                                <ListGroup.Item className="profile-list-group-item"><strong>Ciudad:</strong> {userProfile?.city}</ListGroup.Item>
                                */}
                <ListGroup.Item className="profile-list-group-item">
                  <strong>Rol:</strong>{" "}
                  {userProfile?.roles &&
                    userProfile.roles.length > 0 &&
                    userProfile.roles[0].name}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="mt-4">
        <Ventas />
      </div>
    </Container>
  );
};

export default Profile;
