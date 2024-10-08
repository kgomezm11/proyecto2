import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import { Modal, Button } from 'react-bootstrap';
import { AvisoErrorInterface } from './AvisoErrorTypes';

function AvisoError({ show, handleClose, mensaje }: AvisoErrorInterface) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Resultado de la operación</Modal.Title>
                <Stack direction="horizontal" gap={2}>
                    <Badge pill bg="danger">Error</Badge>
                </Stack>
            </Modal.Header>
            <Modal.Body>
                <p>{mensaje}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AvisoError;
