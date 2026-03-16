import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import styles from "./NotFound.module.scss";
import svg from "../../../assets/images/404.svg";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container fluid className={`mt-5 ${styles.notFound}`}>
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <h1 className="display-4">Page Not Found</h1>
          <p className="lead">The page you are looking for does not exist.</p>
          <img src={svg} alt="404"></img>
        </Col>
      </Row>
      <Button variant="primary" className="mt-3" onClick={() => navigate("/", { replace: true })}>
        Go to Home
      </Button>
    </Container>
  );
}

export default NotFound;
