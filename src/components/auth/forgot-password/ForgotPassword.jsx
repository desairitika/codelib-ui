import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import styles from "./ForgotPassword.module.scss";
import { forgetAction, resetAction, reset } from "../../../redux/actions/forgotPasswordAction";
import Loader from "../../common/loaders/Loader";
import { useToast } from "../../../hooks/useToast";
import { useDebounceCallback } from "../../../hooks/useDebounceCallback";

const ForgotPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("forgot"); // 'forgot' or 'reset'
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { loading, error, emailSent, resetDone } = useSelector((state) => state.forgotPassword);
  const dispatch = useDispatch();
  const [hasOtp, setHasOtp] = useState(true); // State to track if user has OTP manually
  const { setToast } = useToast();

  useEffect(() => {
    if (error) {
      setMessage("");
      const errMsg = typeof error === 'string' ? error : (error?.error || "Something went wrong.");
      setFormError(errMsg);
      setToast(errMsg, "Error");
      dispatch(reset());
    }

    if (emailSent) {
      setStep("reset");
      setFormError("");
      setMessage("Email sent. Check your inbox for password reset instructions.");
      resetForm(false); // Keep email — it's needed for OTP verification
    }

    if (resetDone) {
      setFormError("");
      setMessage("Password reset successfully. Redirecting to login...");
      resetForm(true);
      dispatch(reset());
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [dispatch, error, resetDone, emailSent, step]);

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    debouncedForgotSubmit();
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    debouncedResetSubmit();
  };

  // Debounced forgot password submit
  const debouncedForgotSubmit = useDebounceCallback(
    useCallback(() => {
      dispatch(forgetAction({ email }));
    }, [email, dispatch]),
    500
  );

  // Debounced reset password submit
  const debouncedResetSubmit = useDebounceCallback(
    useCallback(() => {
      if (newPassword === confirmPassword) {
        dispatch(resetAction({ email, otp, newPassword }));
      } else {
        setFormError("Pasword does not match.");
      }
    }, [email, otp, newPassword, confirmPassword, dispatch]),
    500
  );

  const handlePageRoute = () => {
    if (hasOtp) {
      setStep("reset");
    } else {
      setStep("forgot");
    }
    setHasOtp(!hasOtp);
    setFormError("");
    setMessage("");
  };

  const resetForm = (clearEmail = false) => {
    if (clearEmail) setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <Container fluid className={`bg-light min-vh-100 d-flex align-items-center ${styles.container}`}>
      {loading && <Loader></Loader>}
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="p-3 bg-white shadow-lg rounded">
              <h2 className="text-center mb-4">{step === "forgot" ? "Forgot Password" : "Reset Password"}</h2>
              {message && <Alert variant="success">{message}</Alert>}
              {formError && <Alert variant="danger">{formError}</Alert>}
              <Form onSubmit={step === "forgot" ? handleForgotSubmit : handleResetSubmit}>
                {step === "forgot" ? (
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </Form.Group>
                ) : (
                  <>
                    <Form.Group className="mb-3" controlId="formToken">
                      <Form.Label>OTP</Form.Label>
                      <Form.Control type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formNewPassword">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formConfirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </Form.Group>
                  </>
                )}
                <Button variant="primary" type="submit" className="w-100">
                  {step === "forgot" ? "Send Reset Email" : "Reset Password"}
                </Button>
              </Form>
              <div className="text-center mb-3">
                <Button variant="link" style={{ textDecoration: "none" }} onClick={handlePageRoute}>
                  {hasOtp ? "I have OTP" : "I don't have OTP"}
                </Button>
              </div>
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
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default ForgotPasswordReset;
