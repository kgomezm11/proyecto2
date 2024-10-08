import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import { Modal, Button } from 'react-bootstrap';
import { AvisoExitosoProps } from './AvisoExitosoInterface';

function AvisoExitoso({ show, handleClose, mensaje, mensaje2 }: AvisoExitosoProps) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Resultado de la operación</Modal.Title>
                <Stack direction="horizontal" gap={2}>
                    <Badge pill bg="success">Éxito</Badge>
                </Stack>
            </Modal.Header>
            <Modal.Body>
                <p>{mensaje}</p>
                <p>{mensaje2}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AvisoExitoso;
