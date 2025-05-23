import React from "react";
import { Card } from "react-bootstrap";

function UserListItem({ user, handleFunction, isSmall = false }) {
  return (
    <Card
      onClick={handleFunction}
      className="mb-2 shadow-sm"
      style={{
        cursor: "pointer",
        borderRadius: "9px",
        backgroundColor: "ThreeDFace",
        padding: 0,
        overflow:"hidden"       
      }}
    >
      <Card.Body
        className="d-flex align-items-center userCard"
        style={{ padding: isSmall ? "6px" : "12px" }}
      >
        <Card.Img
          src={user.image}
          style={{
            height: isSmall ? "35px" : "57px",
            width: isSmall ? "35px" : "57px",
            borderRadius: "30px",
            objectFit: "cover",
            marginRight: isSmall ? "8px" : "12px",
          }}
        />
        <div>
          <div className="mb-1 fw-bold" style={{ fontSize: isSmall ? "14px" : "16px" }}>
            {user.name}
          </div>
          <div className="text-muted" style={{ fontSize: isSmall ? "12px" : "14px" }}>
            {user.email}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default UserListItem;
