import React from 'react';
import { Alert, Button } from 'react-bootstrap';

interface ConfirmAlertProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmAlert: React.FC<ConfirmAlertProps> = ({ show, onHide, onConfirm, title, message }) => {
  if (!show) return null;

  return (
      <Alert variant="warning" onClose={onHide} dismissible
      style={{width: '90%', maxWidth: 400, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <Alert.Heading>{title}</Alert.Heading>
        <p>{message}</p>
        <div className="d-flex justify-content-end">
          <Button onClick={onHide} variant="primary" className="me-2">
            Cancelar
          </Button>
          <Button onClick={onConfirm} variant="danger">
            Confirmar
          </Button>
        </div>
      </Alert>
  );
};

export default ConfirmAlert;