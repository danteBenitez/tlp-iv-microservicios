import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchUsers, IUser } from '../../store/slices/userSlice';
import { fetchEmployeesByNameOrDni } from '../../store/slices/userSlice';
import axiosInstance from '../../store/actionAxios';
import { showNotification } from '../../store/slices/notificationSlice';
import { Button, Col, Container } from 'react-bootstrap';
import Select, { SingleValue } from 'react-select';
import { debounce } from 'lodash';
import { Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

const Users = () => {
    const dispatch: AppDispatch = useDispatch();
    const { users, loading, error } = useSelector((state: RootState) => state.users);
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const currentUserAutorizete = currentUser?.rol === 'admin' || currentUser?.rol === 'superAdmin';

    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [search, setSearch] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<IUser | null>(null);
    const [options, setOptions] = useState<IUser[]>([]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const searchEmployee = useCallback(debounce(async (inputValue: string, setSearchResults: React.Dispatch<React.SetStateAction<IUser[]>>) => {
        if (typeof inputValue !== 'string') {
            dispatch(showNotification({ message: 'Valor de búsqueda inválido', type: 'error' }));
            return;
        }
        try {
            const response = await dispatch(fetchEmployeesByNameOrDni(inputValue)).unwrap();
            setSearchResults(response.slice(0, 10));
        } catch (error: any) {
            dispatch(showNotification({ message: `Error al buscar el empleado: ${error.message}`, type: 'error' }));
        }
    }, 500), [dispatch]);

    const handleSearchChange = (inputValue: string) => {
        if (inputValue.length < 3) return;
        searchEmployee(inputValue, setOptions);
    }

    const handleSelectChange = (selectedOption: SingleValue<{ value: string | undefined, label: string }>) => {
        const selectedUser = options.find(option => option._id === selectedOption?.value) || null;
        setSelectedEmployee(selectedUser);
        setOptions([]);
    }
    const handleInsertClick = () => {
        if (selectedEmployee) {
            const confirm = window.confirm(`Do you want to insert ${selectedEmployee.name} in the user list?`);
            if (confirm) {
                setSelectedUser(selectedEmployee);
                setSearch(false);
            }
        }
    }

    const handleCreateOrUpdateUser = async (user: IUser) => {
        try {
            if (isEditing && user._id) {
                await axiosInstance.put(`/users/${user._id}`, user);
                dispatch(showNotification({ message: 'User updated successfully', type: 'success' }));
            } else {
                await axiosInstance.post('/users', user);
                dispatch(showNotification({ message: 'User created successfully', type: 'success' }));
            }
            dispatch(fetchUsers());
            handleCancel();
        } catch (error: any) {
            console.error('Error saving user:', error);
            dispatch(showNotification({ message: error.response.data.message, type: 'error' }));
        }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await axiosInstance.delete(`/users/${id}`);
            dispatch(showNotification({ message: 'User deleted successfully', type: 'success' }));
            dispatch(fetchUsers());
        } catch (error: any) {
            console.error('Error deleting user:', error.response.data.message);
            dispatch(showNotification({ message: error.response.data.message, type: 'error' }));
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
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container fluid>
            <h1 className="mb-4">Users</h1>
            <div className="row border">
                <Col lg={12}>
                    <div className="col-md-auto">
                        <h2>User List</h2>
                        <div style={{ overflow: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>DNI</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>City</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users && users.map(user => (
                                        <tr key={user._id}>
                                            <td>{`${user.lastName}, ${user.name}`}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.dni}</td>
                                            <td>{user.phone}</td>
                                            <td>{user.address}</td>
                                            <td>{user.city}</td>
                                            <td>
                                                <button className="btn btn-warning me-2" onClick={() => handleEditUser(user)} disabled={!currentUserAutorizete} >Edit</button>
                                                <button className="btn btn-danger" onClick={() => handleDeleteUser(user._id!)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Col>
                {currentUser && currentUser.rol === 'admin' || currentUser && currentUser.rol === 'superAdmin' &&
                    <>
                        <Col md={5}>
                            <Form onSubmit={(e) => {
                                e.preventDefault();
                                if (selectedUser) handleCreateOrUpdateUser(selectedUser);
                            }}>
                                <div className='d-flex justify-content-between'>
                                    <h2>{isEditing ? 'Edit User' : 'Create User'}</h2>
                                    <div className='d-flex align-items-end'>
                                        {!isEditing &&
                                            <Button size='sm' variant="outline-secondary" onClick={() => setSearch(!search)}>
                                                <FaSearch />
                                            </Button>
                                        }
                                    </div>
                                </div>                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter name" name="name" value={selectedUser?.name || ''} onChange={handleInputChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter last name" name="lastName" value={selectedUser?.lastName || ''} onChange={handleInputChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" placeholder="Enter username" name="username" value={selectedUser?.username || ''} onChange={handleInputChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter password" name="password" value={selectedUser?.password || ''} onChange={handleInputChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" name="email" value={selectedUser?.email || ''} onChange={handleInputChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Label>DNI</Form.Label>
                                    <Form.Control type="text" placeholder="Enter dni" name="dni" value={selectedUser?.dni || ''} onChange={handleInputChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control type="text" placeholder="Enter phone" name="phone" value={selectedUser?.phone || ''} onChange={handleInputChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" placeholder="Enter address" name="address" value={selectedUser?.address || ''} onChange={handleInputChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control type="text" placeholder="Enter city" name="city" value={selectedUser?.city || ''} onChange={handleInputChange} required />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    {isEditing ? 'Update' : 'Create'}
                                </Button>
                                <Button variant="secondary" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </Form>
                        </Col>
                        <Col md={7}>
                            {search &&
                                <div className='col'>
                                    <Select
                                        placeholder='Search employee'
                                        defaultValue={null}
                                        onInputChange={(inputValue) => {
                                            if (typeof inputValue === 'string') {
                                                handleSearchChange(inputValue);
                                            }
                                        }}
                                        onChange={handleSelectChange}
                                        options={options.map(employee => ({ value: employee._id, label: `${employee.lastName} ${employee.name} - ${(employee as any).cuil}` }))}
                                        noOptionsMessage={() => 'No employees found'}
                                    ></Select>
                                    <Button className='mt-3' onClick={handleInsertClick}>Insertar</Button>
                                </div>
                            }
                        </Col>
                    </>
                }
            </div>
        </Container>
    );
};

export default Users;