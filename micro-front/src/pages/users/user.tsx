import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../store/actionAxios";
import { showNotification } from "../../store/slices/notificationSlice";
import { fetchUsers, IUser } from "../../store/slices/userSlice";
import { AppDispatch, RootState } from "../../store/store";
import { Mantenimiento } from "../components/Mantenimiento";

const Users = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserAutorizete =
    currentUser?.roles &&
    currentUser?.roles.some((role: { name: string }) => role.name === "admin");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreateOrUpdateUser = async (user: IUser) => {
    console.log("user", user);
    try {
      const userData = {
        ...user,
        roles: user.roles ? user.roles.map((role) => role.name.trim()) : [],
      };
      if (isEditing && user.userId) {
        await axiosInstance.patch(`/auth/users/${user.userId}`, userData);
        dispatch(
          showNotification({
            message: "User updated successfully",
            type: "success",
          })
        );
      } else {
        await axiosInstance.post("/auth/users", userData);
        dispatch(
          showNotification({
            message: "User created successfully",
            type: "success",
          })
        );
      }
      dispatch(fetchUsers());
      handleCancel();
    } catch (error: any) {
      console.error("Error saving user:", error);
      if (error.message) {
        dispatch(showNotification({ message: error.message, type: "error" }));
      } else {
        dispatch(
          showNotification({
            message: error.response.data.message,
            type: "error",
          })
        );
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await axiosInstance.delete(`/auth/users/${id}`);
      dispatch(
        showNotification({
          message: "User deleted successfully",
          type: "success",
        })
      );
      dispatch(fetchUsers());
    } catch (error: any) {
      console.error("Error deleting user:", error.response.data.message);
      dispatch(
        showNotification({
          message: error.response.data.message,
          type: "error",
        })
      );
    }
  };

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value } as IUser);
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setIsEditing(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Mantenimiento />;
  }

  return (
    <Container fluid>
      <h1 className="mb-4">Users</h1>
      <div className="row border">
        <Col lg={12}>
          <div className="col-md-auto">
            <h2>User List</h2>
            <div style={{ overflow: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users &&
                    users.map((user) => (
                      <tr key={user.userId}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.roles && user.roles.length > 0
                            ? user.roles[0].name
                            : ""}
                        </td>
                        <td>
                          <button
                            className="btn btn-warning me-2"
                            onClick={() => handleEditUser(user)}
                            disabled={!currentUserAutorizete}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteUser(user.userId!)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
        {currentUser && currentUserAutorizete && (
          <>
            <Col md={5}>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (selectedUser) handleCreateOrUpdateUser(selectedUser);
                }}
              >
                <div className="d-flex justify-content-between">
                  <h2>{isEditing ? "Edit User" : "Create User"}</h2>
                </div>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    value={selectedUser?.username || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={selectedUser?.password || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={selectedUser?.email || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter role"
                    name="roles"
                    defaultValue={
                      selectedUser?.roles && selectedUser.roles.length > 0
                        ? selectedUser?.roles[0].name
                        : ""
                    }
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  {isEditing ? "Update" : "Create"}
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Form>
            </Col>
          </>
        )}
      </div>
    </Container>
  );
};

export default Users;
