import React, { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AvisoExitoso from '../AvisoExitoso/AvisoExitoso';
import AvisoError from '../AvisoError/AvisoError';
import { useNavigate } from 'react-router-dom';
import './ProductosNuevo.scss';
import AvisoLogin from '../AvisoLogin/AvisoLogin';

function ProductosNuevo() {
    const { state, token, usuario, dpi } = useAuth();
    const navigate = useNavigate();
    const [avisoExitosoMensaje, setAvisoExitosoMensaje] = useState('');
    const [avisoErrorMensaje, setAvisoErrorMensaje] = useState('');
    const [showModalExito, setShowModalExito] = useState(false);
    const [showModalError, setShowModalError] = useState(false);
    const [cantidad, setCantidad] = useState(1);

    const handleTokensChange = (e) => {
        const value = e.target.value;

        // Permitir la entrada en blanco o números dentro del rango 1-5
        if (value === '' || (Number(value) >= 1 && Number(value) <= 5)) {
            setFormData({
                ...formData,
                tokens: value, // Actualiza tokens en formData
            });
        }
    };

    const handleTokensBlur = () => {
        // Si está vacío al perder el foco, establecer el valor mínimo
        if (formData.tokens === '') {
            setFormData({
                ...formData,
                tokens: 1, // Asegura que no esté vacío
            });
        }
    };

    const handleShowModalExito = (mensaje) => {
        setAvisoExitosoMensaje(mensaje);
        setShowModalExito(true);
        setTimeout(() => {
            navigate('/cursos');
        }, 2500);
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


    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        imagen: '',
        tokens: '',
        recursos: [],
        categorias: '',
    });


    // Maneja los cambios en los campos del formulario
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        // Actualiza el objeto formData con el nuevo valor
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    // Maneja el clic en el botón
    const crearProducto = () => {
        const categoriasArray = formData.categorias.split(',').map(categoria => categoria.trim());

        // Estructura de los campos anidados
        const usuario2 = [{
            dpi_usuario: dpi, // Aquí podrías usar el valor dinámico si lo tienes en el state
            usuario: usuario
        }];
        const tokensN = Number(formData.tokens)
        // Datos completos para enviar
        const updatedFields = {
            ...formData,
            categorias: categoriasArray,
            tokens: formData.tokens, // Asegura que los tokens sean un número          
            usuario: usuario2, // Incluyendo los datos de usuario
            recursos: [{
                video: formData.video,
                audio: formData.audio,
                documento: formData.documento,
                varios: formData.varios
            }]
        };
        console.log(tokensN);
        var myHeaders = new Headers();
        myHeaders.append("authorization", token);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(updatedFields);
        console.log(raw);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'

        };

        fetch("http://localhost:5000/api/curso", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    handleShowModalError(data.error);
                } else if (data.mensaje) {
                    handleShowModalExito(data.mensaje);
                }
            })
            .catch(error => console.log('error', error));
    };



    return (
        <>
            {
                state.isAuthenticated ? (
                    <div className="container">
                        <br />
                        <h1>Ingresa los datos del curso</h1>
                        <div className="product-details-container">
                            <Form>
                                <div className="left-column">
                                    <Form.Group className="mb-3" controlId="titulo">
                                        <Form.Label>Título</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="titulo"
                                            placeholder="Título"
                                            value={formData.titulo}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="descripcion">
                                        <Form.Label>Descripcion</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={8}
                                            name="descripcion"
                                            placeholder="Descripcion"
                                            value={formData.descripcion}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="imagen">
                                        <Form.Label>Imagen (URL)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="imagen"
                                            placeholder="Imagen"
                                            value={formData.imagen}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="tokens">
                                        <Form.Label>Tokens</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="tokens"
                                            placeholder=""
                                            value={formData.tokens}
                                            onChange={handleTokensChange}
                                            onBlur={handleTokensBlur} // Validar al perder el foco
                                            min='1'
                                            max='5'
                                        />
                                    </Form.Group>

                                </div>
                                <div className="right-column">
                                    <Form.Group className="mb-3" controlId="Video">
                                        <Form.Label>Video</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="video"
                                            placeholder="Video"
                                            value={formData.video}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="Audio">
                                        <Form.Label>Audio</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="audio"
                                            placeholder="Audio"
                                            value={formData.audio}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="Documento">
                                        <Form.Label>Documento</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="documento"
                                            placeholder="Documento"
                                            value={formData.documento}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="Varios">
                                        <Form.Label>Varios</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="varios"
                                            placeholder="Varios"
                                            value={formData.varios}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="categorias">
                                        <Form.Label>Categorías (separar por comas)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="categorias"
                                            placeholder="Categorías"
                                            value={formData.categorias}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </div>
                                <Button style={{ float: 'right' }} variant="primary" type="button" onClick={crearProducto}>
                                    Crear
                                </Button>
                                <br />

                            </Form>

                        </div >
                        <br />
                        <br />
                        <AvisoExitoso show={showModalExito} handleClose={handleCloseModalExito} mensaje={avisoExitosoMensaje} mensaje2={'Serás redireccionado...'} />
                        <AvisoError show={showModalError} handleClose={handleCloseModalError} mensaje={avisoErrorMensaje} />
                    </div >
                ) : (
                    <AvisoLogin />
                )}
        </>
    );

}

export default ProductosNuevo;
