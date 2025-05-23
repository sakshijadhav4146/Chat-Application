import React from 'react';
import { Toast, ToastContainer as RBToastContainer } from 'react-bootstrap';

function AppToast({ showToast, setShowToast, toastMessage, toastVariant }) {
  return (
    <RBToastContainer
      position="top-center"
      className="p-3"
      style={{ zIndex: 9999 }}
    >
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        bg={toastVariant}
        delay={3000}
        autohide
      >
        <Toast.Body className="text-white text-center">
          {toastMessage}
        </Toast.Body>
      </Toast>
    </RBToastContainer>
  );
}

export default AppToast;
