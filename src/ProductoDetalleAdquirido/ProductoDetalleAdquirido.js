import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import AvisoExitoso from '../AvisoExitoso/AvisoExitoso';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './ProductoDetalleAdquirido.scss';
import AvisoError from '../AvisoError/AvisoError';
import AvisoLogin from '../AvisoLogin/AvisoLogin';

function ProductoDetalleAdquirido() {
    const { state, token } = useAuth();
    const { _id } = useParams();
    const [productoInfo, setProductoInfo] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [avisoExitosoMensaje, setAvisoExitosoMensaje] = useState('');
    const [avisoErrorMensaje, setAvisoErrorMensaje] = useState('');
    const [showModalError, setShowModalError] = useState(false);

    const handleShowModal = (mensaje) => {
        setAvisoExitosoMensaje(mensaje);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleShowModalError = (mensaje) => {
        setAvisoErrorMensaje(mensaje);
        setShowModalError(true);
    };

    const handleCloseModalError = () => {
        setShowModalError(false);
    };

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("authorization", token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/cursos/${_id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setProductoInfo(data);
            })
            .catch(error => console.error('Error al obtener detalles del producto:', error));
    }, [_id, token]);


    const añadirCarrito = async () => {
        if (cantidad > 0) {
            var myHeaders = new Headers();
            myHeaders.append("authorization", token);
            myHeaders.append("Content-Type", "application/json");

            // Enviar el ID correcto como idCurso
            var raw = JSON.stringify({
                "idCurso": productoInfo._id
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://localhost:5000/api/compra", requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.mensaje) {
                        const mensaje = data.mensaje;
                        setAvisoExitosoMensaje(mensaje);
                        handleShowModal(mensaje);
                    }
                    if (data.error) {
                        const mensaje = data.error;
                        setAvisoErrorMensaje(mensaje);
                        handleShowModalError(mensaje);
                    }
                })
                .catch(error => console.log('error', error));
        }
    };

    return (
        <>
            {
                state.isAuthenticated ? (
                    <div className="container">
                        <br />
                        <h1>Detalles del curso</h1>
                        <div className="product-details-container">
                            {
                                productoInfo ? (
                                    <>
                                        <div className="product-text">
                                            <h2>{productoInfo.titulo}</h2>
                                            <br />
                                            <h4>Recursos:</h4>
                                            <br />
                                            <p><b>Video: </b>
                                                <a href={productoInfo.recursos[0].video} target="_blank" rel="noopener noreferrer">
                                                {productoInfo.recursos[0].video}
                                                </a>
                                            </p>


                                            <p><b>Tokens: </b>{productoInfo.tokens}</p>
                                            <br /><br />
                                            <p><b>Publicado por:</b> {productoInfo.usuario[0].usuario}</p>
                                            <p><b>Temas relacionados: </b>{productoInfo.categorias[0]}, {productoInfo.categorias[1]}, {productoInfo.categorias[2]}</p>

                                            <Button className='btn-custom' variant="primary" type="button" onClick={() => {
                                                añadirCarrito();
                                            }}>
                                                Comprar
                                            </Button>
                                            <AvisoExitoso show={showModal} handleClose={handleCloseModal} mensaje={avisoExitosoMensaje} />
                                            <AvisoError show={showModalError} handleClose={handleCloseModalError} mensaje={avisoErrorMensaje} />
                                        </div>
                                    </>
                                ) : (
                                    <p></p>
                                )
                            }
                        </div>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                ) : (
                    <AvisoLogin />
                )
            }
        </>
    );

}

export default ProductoDetalleAdquirido;
