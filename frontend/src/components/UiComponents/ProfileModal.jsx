import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function ProfileModal({ user, children }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {children ? (
  <span onClick={handleShow} style={{ cursor: "pointer" }}>{children}</span>
) : (
  <Button
    variant="light"
    className="d-flex align-items-center"
    onClick={handleShow}
  >
   🔍 Peek Profile 
  </Button>
)}

      <Modal show={show} onHide={handleClose} style={{height:"450px", borderRadius:"30px", margin:"80px"}}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize:"40px", fontFamily:"Work sans" , display:"flex",marginLeft:"188px" }}>{user.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
          src={user.image}
         style={{height:"200px", marginLeft:"25%",borderRadius:"200px"}}
         alt={user.name}
          />
          <h4 className="d-flex justify-content-center">{user.email}</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProfileModal;
