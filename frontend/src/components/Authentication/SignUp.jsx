import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppToast from "./AppToast";
import {
  Stack,
  Form,
  Button,
  Container,
  InputGroup,
  Spinner,
} from "react-bootstrap";

function SignUp() {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);

  const [imageUploading, setImageUploading] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const postDetails = (pics) => {
  
    setImageUploading(true);
    setLoading(true);

    if (!pics) {
      setLoading(false);
      setImageUploading(false); 
      setToastMessage("No file selected.");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    if (
      pics.type === "image/jpg" ||
      pics.type === "image/jpeg" ||
      pics.type === "image/png"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dh1cyxepv");

      fetch("https://api.cloudinary.com/v1_1/dh1cyxepv/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.url) {
            setPic(data.url.toString());
          } else {
            setToastMessage("Upload failed: No URL received.");
            setToastVariant("danger");
            setShowToast(true);
          }
          setLoading(false);
          setImageUploading(false); 
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setImageUploading(false); 
          setToastMessage("Upload Failed.");
          setToastVariant("danger");
          setShowToast(true);
        });
    } else {
      setLoading(false);
      setImageUploading(false); 
      setToastMessage("Please upload a valid image (JPG or PNG).");
      setToastVariant("warning");
      setShowToast(true);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (imageUploading) {
      setLoading(false);
      setToastMessage("Please wait for the image to finish uploading.");
      setToastVariant("warning");
      setShowToast(true);
      return;
    }

    if (!name || !email || !password || !confirmpassword) {
      setLoading(false);
      setToastMessage("All fields are required");
      setToastVariant("warning");
      setShowToast(true);
      return;
    }

    if (password !== confirmpassword) {
      setLoading(false);
      setToastMessage("Passwords do not match");
      setToastVariant("warning");
      setShowToast(true);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, image:pic },
        config
      );
      console.log(data)

      setToastMessage("Registration successful");
      setToastVariant("success");
      setShowToast(true);

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      setLoading(false);
      setToastMessage("Error occurred");
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
        className="d-flex justify-content-center align-items-center"
        style={{ height: "74vh" }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h3 className="text-center mb-4">Sign Up</h3>
          <Form onSubmit={submitHandler}>
            <Stack gap={2}>
              <Form.Group controlId="formName">
                <Form.Label className="d-flex fw-bold">Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

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

              <Form.Group controlId="formConfirmPassword">
                <Form.Label className="d-flex fw-bold">
                  Confirm Password
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmpassword}
                    onChange={(e) => setConfirmpassword(e.target.value)}
                  />
                  <Button
                    variant="link"
                    className="ms-2"
                    onClick={() => setShowConfirm(!showConfirm)}
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
                    {showConfirm ? "Hide" : "Show"}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="formFile">
                <Form.Label className="d-flex fw-bold">
                  Upload Profile Picture
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => postDetails(e.target.files[0])}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="rounded-pill mt-2"
                // ✅ disable submit button if image is still uploading
                disabled={loading || imageUploading}
              >
                {loading || imageUploading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="ms-2">
                      {imageUploading ? "Uploading..." : "Loading..."}
                    </span>
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </Stack>
          </Form>
        </div>
      </Container>
    </>
  );
}

export default SignUp;
