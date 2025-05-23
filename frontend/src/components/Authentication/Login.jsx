import React, { useState } from "react";
import {
  Stack,
  Form,
  Button,
  Container,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppToast from "./AppToast";
import axios from "axios";
function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      setToastMessage("All fields are required");
      setToastVariant("warning");
      setShowToast(true);
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      setToastMessage("Login succesfull");
      setToastVariant("success");
      setShowToast(true);

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);

      navigate("/chats");
    } catch (error) {
      setLoading(false);
      setToastMessage("Error occured");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return (
    <>
      <AppToast
        showToast={showToast}
        setShowToast={setShowToast}
        toastMessage={toastMessage}
        toastVariant={toastVariant}
      />
      <Container
        className="d-flex justify-content-center align-items-center mb-7"
        style={{ height: "47vh" }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h3 className="text-center mb-4">Login</h3>
          <Form onSubmit={submitHandler}>
            <Stack gap={2}>
              <Form.Group controlId="formEmail">
                <Form.Label className="d-flex fw-bold">
                  Email address
                </Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Label className="d-flex fw-bold">Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={show ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    variant="link"
                    className="ms-2"
                    onClick={() => setShow(!show)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      textDecoration: "none",
                      color: "#000",
                      fontSize: "14px",
                    }}
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="rounded-pill mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="ms-2">Loading...</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              {/* <Button
                variant="danger"
                type="submit"
                className="rounded-pill mt-2"
                onClick={(e) => {
                  e.preventDefault();
                  setEmail("guest@example.com");
                  setPassword("12345");
                }}
              >
                Get Guest User Credentials
              </Button> */}
            </Stack>
          </Form>
        </div>
      </Container>
    </>
  );
}

export default Login;
