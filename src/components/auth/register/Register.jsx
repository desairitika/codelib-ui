import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../../redux/actions/authActions";
import { RegisterAction, registerReset } from "../../../redux/actions/registerAction";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Loader from "../../common/loaders/Loader";
import { getToken } from "../../../utils/TokenUtil";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useToast } from "../../../hooks/useToast";
import { validateForm, validators } from "../../../utils/validators";
import { useDebounceCallback } from "../../../hooks/useDebounceCallback";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { loading, error, isUserCreated } = useSelector((state) => state.register);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State for showing modal
  const token = getToken();
  const { setToast } = useToast();

  const validateForm_ = () => {
    const rules = {
      name: {
        required: true,
        label: "Name",
        validator: validators.name,
      },
      email: {
        required: true,
        label: "Email",
        validator: validators.email,
      },
      username: {
        required: true,
        label: "Username",
        validator: validators.username,
      },
      password: {
        required: true,
        label: "Password",
        validator: validators.password,
      },
    };

    const validation = validateForm(formData, rules);
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  // Use debounced submit to prevent duplicate requests
  const debouncedSubmit = useDebounceCallback(
    useCallback(() => {
      if (validateForm_()) {
        dispatch(RegisterAction(formData));
      }
    }, [formData, dispatch]),
    500
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    debouncedSubmit();
  };

  const handleFieldChange = (event) => {
    setFormData({ ...formData, [event.currentTarget.id]: event.target.value });
  };

  const handleClear = () => {
    setFormData({
      name: "",
      lastname: "",
      email: "",
      username: "",
      password: "",
      gender: "",
    });
  };

  useEffect(() => {
    if (isUserCreated) {
      setToast("User Created");
      handleClear();
      dispatch(registerReset());
    }
  }, [isUserCreated, dispatch, error]);

  useEffect(() => {
    if (error) {
      setToast(error, "Error", "danger", 5000);
      dispatch(registerReset());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (isAuthenticated || token) {
      setShowModal(true); // Show the modal if authenticated
    } else {
      setShowModal(false); // Hide the modal if not authenticated
    }
  }, [isAuthenticated, token]);

  const closeModal = () => {
    setShowModal(false);
    dispatch(logoutAction());
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`container-fluid ${styles.loginContainer}`}>
      {loading && <Loader></Loader>}
      <div className="row justify-content-center w-100">
        <div className="col-md-6">
          <div className={`card ${styles.loginCard}`}>
            <div className="card-body">
              <h3 className={`card-title text-center ${styles.loginTitle}`}>Register</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.name ? "is-invalid" : ""}`}
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      handleFieldChange(e);
                      if (validationErrors.name) {
                        setValidationErrors((prev) => ({
                          ...prev,
                          name: "",
                        }));
                      }
                    }}
                    required
                  />
                  {validationErrors.name && (
                    <div className="invalid-feedback d-block">{validationErrors.name}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="lastname" className="form-label">
                    Last Name
                  </label>
                  <input type="text" className="form-control" id="lastname" value={formData.lastname} onChange={handleFieldChange} />
                </div>
                <div>
                  <label htmlFor="gender" className="form-label">
                    Gender
                  </label>
                  <Form.Select aria-label="Gender" id="gender" className="mb-3" value={formData.gender} onChange={handleFieldChange}>
                    <option value="">--Select--</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    User Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.username ? "is-invalid" : ""}`}
                    id="username"
                    value={formData.username}
                    onChange={(e) => {
                      handleFieldChange(e);
                      if (validationErrors.username) {
                        setValidationErrors((prev) => ({
                          ...prev,
                          username: "",
                        }));
                      }
                    }}
                    required
                  />
                  {validationErrors.username && (
                    <div className="invalid-feedback d-block">{validationErrors.username}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className={`form-control ${validationErrors.email ? "is-invalid" : ""}`}
                    id="email"
                    value={formData.email}
                    onChange={(e) => {
                      handleFieldChange(e);
                      if (validationErrors.email) {
                        setValidationErrors((prev) => ({
                          ...prev,
                          email: "",
                        }));
                      }
                    }}
                    required
                  />
                  {validationErrors.email && (
                    <div className="invalid-feedback d-block">{validationErrors.email}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${validationErrors.password ? "is-invalid" : ""}`}
                      id="password"
                      value={formData.password}
                      onChange={(e) => {
                        handleFieldChange(e);
                        if (validationErrors.password) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            password: "",
                          }));
                        }
                      }}
                      required
                    />
                    <button className="btn btn-outline-primary" type="button" onClick={togglePasswordVisibility}>
                      {showPassword && <FaRegEye></FaRegEye>}
                      {!showPassword && <FaRegEyeSlash></FaRegEyeSlash>}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <div className="invalid-feedback d-block">{validationErrors.password}</div>
                  )}
                </div>
                <div className="d-flex" style={{ gap: "5px" }}>
                  <button type="clear" className={`btn btn-secondary w-50 ${styles.loginButton}`} onClick={handleClear}>
                    Clear
                  </button>
                  <button type="submit" className={`btn btn-primary w-50 ${styles.loginButton}`} disabled={loading}>
                    {/* {loading ? "Registering..." : "Register"} */}
                    Register
                  </button>
                </div>
              </form>
              <div className="mt-4">
                Back to login?{" "}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal to show when authenticated */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Attention!</Modal.Title>
        </Modal.Header>
        <Modal.Body>You are already logged in. Continue to your dashboard or Logout</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Logout
          </Button>
          <Button variant="primary" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

Register.propTypes = {};

export default Register;
