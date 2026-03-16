import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { Container, Table, Button, Modal, Form, Alert, Pagination } from "react-bootstrap";
import styles from "./UserManagement.module.scss";
import Loader from "../../common/loaders/Loader";

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      _id: "1",
      name: "John",
      lastname: "Doe",
      email: "john@example.com",
      username: "johndoe",
      role: "user",
      gender: "male",
    },
    {
      _id: "2",
      name: "Jane",
      lastname: "Smith",
      email: "jane@example.com",
      username: "janesmith",
      role: "user",
      gender: "female",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    username: "",
    role: "user",
    gender: "",
  });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const handleShowModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        lastname: "",
        email: "",
        username: "",
        role: "user",
        gender: "",
      });
    }
    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.username.trim()) {
      setError("Name, email, and username are required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email format");
      return false;
    }
    return true;
  };

  const handleSaveUser = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingUser) {
        setUsers((prev) =>
          prev.map((u) => (u._id === editingUser._id ? { ...formData, _id: editingUser._id } : u))
        );
      } else {
        setUsers((prev) => [
          ...prev,
          {
            ...formData,
            _id: String(Math.max(...users.map((u) => parseInt(u._id) || 0)) + 1),
          },
        ]);
      }

      handleCloseModal();
      setError("");
    } catch (err) {
      setError("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } catch (err) {
        setError("Failed to delete user");
      } finally {
        setLoading(false);
      }
    }
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <Container fluid className={styles.userManagementContainer}>
      {loading && <Loader />}
      <div className={styles.header}>
        <h1>User Management</h1>
        <Button
          variant="primary"
          className={styles.addBtn}
          onClick={() => handleShowModal()}
        >
          <MdAdd /> Add User
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className={styles.tableWrapper}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Role</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.name} {user.lastname}
                </td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <span className={styles[`role-${user.role}`]}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td>{user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</td>
                <td className={styles.actionButtons}>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleShowModal(user)}
                    title="Edit user"
                  >
                    <MdEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteUser(user._id)}
                    title="Delete user"
                  >
                    <MdDelete />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Pagination className={styles.pagination}>
        <Pagination.First
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter first name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                placeholder="Enter last name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">--Select--</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveUser}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

UserManagement.propTypes = {};

export default UserManagement;
