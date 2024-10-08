import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const AvisoLogin: React.FC = () => {
    return (
        <Card className="text-center container mt-5">
            <Card.Body>
                <Card.Title>¡Atención!</Card.Title>
                <Card.Text>
                    Debes iniciar sesión para acceder a esta página.
                </Card.Text>
                <Button href="/" variant="primary">Iniciar Sesión</Button>
            </Card.Body>
        </Card>
    );
};

export default AvisoLogin;
