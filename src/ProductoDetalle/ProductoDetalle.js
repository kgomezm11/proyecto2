import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AvisoExitoso from '../AvisoExitoso/AvisoExitoso';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './ProductoDetalle.scss';
import AvisoError from '../AvisoError/AvisoError';
import AvisoLogin from '../AvisoLogin/AvisoLogin';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';


function ProductoDetalle() {
    const { state, token } = useAuth();
    const { _id } = useParams();
    const [productoInfo, setProductoInfo] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ comment: '', rating: 0 }); // Estado para el comentario y la calificación
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

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<BsStarFill key={i} />);
            } else if (i - rating < 1 && i - rating > 0) {
                stars.push(<BsStarHalf key={i} />);
            } else {
                stars.push(<BsStar key={i} />);
            }
        }
        return stars;
    };

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("authorization", token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://proyecto1-u7g9.onrender.com/api/cursos/${_id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setProductoInfo(data);
            })
            .catch(error => console.error('Error al obtener detalles del producto:', error));

        fetch(`https://proyecto1-u7g9.onrender.com/api/comments/${_id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setComments(data);
            }).catch(error => console.error('Error al obtener comentarios:', error));
    }, [_id, token]);

    const añadirCarrito = async () => {
        if (cantidad > 0) {
            var myHeaders = new Headers();
            myHeaders.append("authorization", token);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "idCurso": productoInfo._id
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://proyecto1-u7g9.onrender.com/api/compra", requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.mensaje) {
                        handleShowModal(data.mensaje);
                        navigate('/compras');
                    }
                    if (data.error) {
                        handleShowModalError(data.error);
                    }
                })
                .catch(error => console.log('error', error));
        }
    };

    const sendComment = async () => {
        if (!newComment.comment || newComment.rating === 0) {
            const mensaje = 'Debes ingresar un comentario y una valoración.';
            handleShowModalError(mensaje);
            return;
        }

        var myHeaders = new Headers();
        myHeaders.append("authorization", token);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "courseId": productoInfo._id,
            "comment": newComment.comment,
            "rating": newComment.rating
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://proyecto1-u7g9.onrender.com/api/comment", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.mensaje) {
                    handleShowModal(data.mensaje);
                    navigate('/compras');
                }
                if (data.error) {
                    handleShowModalError(data.error);
                }
            })
            .catch(error => console.log('error', error));
    };

    const handleStarClick = (value) => {
        setNewComment({ ...newComment, rating: value }); // Actualiza la valoración
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
                                        <img src={productoInfo.imagen} alt={productoInfo.titulo} className="product-image" />
                                        <div className="product-text">
                                            <h2>{productoInfo.titulo}</h2>
                                            <p><b>Descripción:</b> {productoInfo.descripcion}</p>
                                            <p><b>Tokens: </b>{productoInfo.tokens}</p>
                                            <Button variant="primary" type="button" onClick={añadirCarrito}>
                                                Comprar
                                            </Button>
                                            <AvisoExitoso show={showModal} handleClose={handleCloseModal} mensaje={avisoExitosoMensaje} />
                                            <AvisoError show={showModalError} handleClose={handleCloseModalError} mensaje={avisoErrorMensaje} />
                                        </div>
                                    </>
                                ) : <p>Cargando detalles...</p>
                            }
                        </div>

                        <div className="comments-section">
                            <h3>Comentarios</h3>
                            {
                                comments.length > 0 ? (
                                    comments.map((comentario, index) => (
                                        <div key={index} className="comment">
                                            <p><b>{comentario.user_info.nombres}</b> comentó:</p>
                                            <p>{comentario.texto}</p>
                                            <p><b>Valoración:</b> {renderStars(comentario.recomendado)}</p>
                                            <hr/>
                                        </div>
                                    ))
                                ) : <p>No hay comentarios aún.</p>
                            }

                            <h4>Agregar comentario</h4>
                            <Form>
                                <Form.Group controlId="formComentarioTexto">
                                    <Form.Label>Tu comentario</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Escribe tu comentario aquí..."
                                        value={newComment.comment}
                                        onChange={(e) => setNewComment({...newComment, comment: e.target.value})}
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Valoración</Form.Label>
                                    <div className="stars-rating">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star} onClick={() => handleStarClick(star)}>
                                                {star <= newComment.rating ? <BsStarFill className="star"/> :
                                                    <BsStar className="star"/>}
                                            </span>
                                        ))}
                                    </div>
                                </Form.Group>
                                <br/>
                                <Button variant="primary" type="button" onClick={sendComment}>
                                    Enviar Comentario
                                </Button>
                            </Form>
                        </div>
                    </div>
                ) : <AvisoLogin />
            }
        </>
    );
}

export default ProductoDetalle;
