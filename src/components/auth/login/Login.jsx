import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { loginAction, loginReset } from "../../../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import styles from "./Login.module.scss";
import Loader from "../../common/loaders/Loader";
import { getToken } from "../../../utils/TokenUtil";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useToast } from "../../../hooks/useToast";
import { validators } from "../../../utils/validators";
import { useDebounceCallback } from "../../../hooks/useDebounceCallback";

const Login = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [usernameFlow, setUsernameFlow] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const { user, loading, error, isAuthenticated, fromLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getToken();
  const { setToast } = useToast();

  const validateInputs = () => {
    const errors = {};

    if (usernameFlow) {
      if (!username.trim()) {
        errors.username = "Username is required";
      } else if (username.length < 3) {
        errors.username = "Username must be at least 3 characters";
      }
    } else {
      const emailValidation = validators.email(email);
      if (!email.trim()) {
        errors.email = "Email is required";
      } else if (!emailValidation.isValid) {
        errors.email = emailValidation.message;
      }
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Use debounced login to prevent duplicate requests
  const debouncedLogin = useDebounceCallback(
    useCallback(() => {
      if (validateInputs()) {
        dispatch(loginAction(email, username, password, remember));
      }
    }, [email, username, password, remember, dispatch]),
    500
  );

  const handleLogin = (e) => {
    e.preventDefault();
    debouncedLogin();
  };

  const handleRememberMe = (e) => {
    setRemember(e.target.checked);
  };

  const handleForgetPassword = () => {
    navigate("/forgot-password", { replace: true });
  };

  const handleSignUp = () => {
    navigate("/register", { replace: true });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // On mount, check if loading is stuck and reset it
  useEffect(() => {
    // If loading is true but we haven't submitted the form, there might be a stale login request
    // This can happen if the user navigates away and back to the login page
    if (loading && !email && !username && !password) {
      dispatch(loginReset());
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && token && !error && fromLogin) {
      navigate("/dashboard", { replace: true });
      setToast(`Welcome again ${user?.name}`, "Greetings");
    } else if (isAuthenticated && token && !error) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, token, navigate, error, user, fromLogin]);

  useEffect(() => {
    if (error) {
      setToast(error, "Error");
      dispatch(loginReset());
    }
  }, [error, dispatch]);

  return (
    <div className={`container-fluid ${styles.loginContainer}`}>
      {loading && <Loader></Loader>}
      <div className="row justify-content-center w-100">
        <div className="col-md-6">
          <div className={`card ${styles.loginCard}`}>
            <div className="card-body">
              <h3 className={`card-title text-center ${styles.loginTitle}`}>Login</h3>
              <div className="text-center mb-3">
                <ButtonGroup aria-label="Basic example">
                  <Button variant={usernameFlow ? "primary" : "outline-primary"} onClick={() => setUsernameFlow(true)}>
                    Use Username
                  </Button>
                  <Button variant={usernameFlow ? "outline-primary" : "primary"} onClick={() => setUsernameFlow(false)}>
                    Use Email
                  </Button>
                </ButtonGroup>
              </div>
              <form onSubmit={handleLogin}>
                {!usernameFlow && (
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className={`form-control ${validationErrors.email ? "is-invalid" : ""}`}
                      id="email"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (validationErrors.email) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            email: "",
                          }));
                        }
                      }}
                      value={email}
                      required
                    />
                    {validationErrors.email && (
                      <div className="invalid-feedback d-block">{validationErrors.email}</div>
                    )}
                  </div>
                )}
                {usernameFlow && (
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      User Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${validationErrors.username ? "is-invalid" : ""}`}
                      id="username"
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (validationErrors.username) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            username: "",
                          }));
                        }
                      }}
                      value={username}
                      required
                    />
                    {validationErrors.username && (
                      <div className="invalid-feedback d-block">{validationErrors.username}</div>
                    )}
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${validationErrors.password ? "is-invalid" : ""}`}
                      id="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
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
                <div className="d-flex justify-content-between">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="flexCheckDefault" onChange={(e) => handleRememberMe(e)} />
                    <label className="form-check-label user-select-none" htmlFor="flexCheckDefault">
                      Remember me
                    </label>
                  </div>
                  <div className={styles.forgetButton} onClick={handleForgetPassword}>
                    Forget Password ?
                  </div>
                </div>
                <button type="submit" className={`btn btn-primary w-100 ${styles.loginButton}`} disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
              <div className="mt-4">
                Don't have an account?{" "}
                <Button variant="outline-primary" size="sm" onClick={handleSignUp}>
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {};

export default Login;
