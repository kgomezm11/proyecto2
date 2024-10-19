import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { useAuth } from '../AuthContext/AuthContext';
import AvisoExitoso from '../AvisoExitoso/AvisoExitoso';
import AvisoError from '../AvisoError/AvisoError';
import './CarritoModal.scss';

function CarritoModal({ show, onHide, carritoData }) {
    const { token } = useAuth();
    const [carritoLocal, setCarritoLocal] = useState(null);

    const [avisoExitosoMensaje, setAvisoExitosoMensaje] = useState('');
    const [avisoErrorMensaje, setAvisoErrorMensaje] = useState('');
    const [showModalExito, setShowModalExito] = useState(false);
    const [showModalError, setShowModalError] = useState(false);

    const handleShowModalExito = (mensaje) => {
        setAvisoExitosoMensaje(mensaje);
        setShowModalExito(true);
    };

    const handleCloseModalExito = () => {
        setShowModalExito(false);
    };

    const handleShowModalError = (mensaje) => {
        setAvisoErrorMensaje(mensaje);
        setShowModalError(true);
    };

    const handleCloseModalError = () => {
        setShowModalError(false);
    };


    const handleEliminarProducto = (identificador) => {
        var myHeaders = new Headers();
        myHeaders.append("authorization", token);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "identificador": identificador
        });

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`http://proyecto1-u7g9.onrender.com/api/carrito/`, requestOptions)
            .then(response => response.json())
            .then(data => {

                const updatedCarrito = { ...carritoLocal };


                const productIndex = updatedCarrito.productos.findIndex(item => item.identificador === identificador);

                if (productIndex !== -1) {
     
                    updatedCarrito.productos[productIndex].cantidad--;
                    updatedCarrito.total -= updatedCarrito.productos[productIndex].precio;

         
                    if (updatedCarrito.productos[productIndex].cantidad === 0) {
                        updatedCarrito.productos.splice(productIndex, 1);
                    }

         
                    setCarritoLocal(updatedCarrito);
                }
            })
            .catch(error => console.log('error', error));
    };


    useEffect(() => {
        setCarritoLocal(carritoData);
    }, [carritoData]);

    const groupAndSumProducts = (productos) => {
        if (!productos) {
            return [];
        }

        const groupedProducts = {};

        productos.forEach((item) => {
            if (!groupedProducts[item.identificador]) {
                groupedProducts[item.identificador] = { ...item, cantidad: 0 };
            }

            groupedProducts[item.identificador].cantidad += item.cantidad;
        });

        return Object.values(groupedProducts);
    };

    const groupedProducts = groupAndSumProducts(carritoLocal?.productos);

    const comprarProductos = async () => {
        var myHeaders = new Headers();
        myHeaders.append("authorization", token);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://proyecto1-u7g9.onrender.com/api/compra", requestOptions)
            .then(response => response.json())
            .then(data => {

                onHide();
                if (data.error) {
                    const mensaje = data.error;
                    handleShowModalError();
                    setAvisoErrorMensaje(mensaje);
                    handleShowModalError(mensaje);
                }
                if (data.mensaje) {
                    const mensaje = data.mensaje;
                    handleShowModalExito();
                    setAvisoExitosoMensaje(mensaje);
                    handleShowModalExito(mensaje);
                }

            })
            .catch(error => console.log('error', error));

    };

    return (
        <div >
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Carrito de Compras</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {groupedProducts.map((item) => (
                            <ListGroup.Item key={item.identificador}>
                                {item.nombre} - Q {item.precioDescuento} x {item.cantidad}
                                <button
                                    className="btn btn-danger ml-2 button-borrar"
                                    onClick={() => handleEliminarProducto(item.identificador)}
                                >
                                    Eliminar
                                </button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <br />
                    <h1>Total: Q. {carritoLocal ? carritoLocal.total : 0}</h1>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn-custom' variant="primary" onClick={() => { comprarProductos() }}>
                        Comprar
                    </Button>
                    <Button variant="secondary" onClick={onHide}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <AvisoExitoso show={showModalExito} handleClose={handleCloseModalExito} mensaje={avisoExitosoMensaje} />
            <AvisoError show={showModalError} handleClose={handleCloseModalError} mensaje={avisoErrorMensaje} />
        </div >
    );
}

export default CarritoModal;
