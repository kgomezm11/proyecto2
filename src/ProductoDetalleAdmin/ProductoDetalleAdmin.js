import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AvisoExitoso from '../AvisoExitoso/AvisoExitoso';
import AvisoError from '../AvisoError/AvisoError';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './ProductoDetalleAdmin.scss';
import AvisoLogin from '../AvisoLogin/AvisoLogin';

function ProductoDetalleAdmin() {
    const { state, token } = useAuth();
    const { identificador } = useParams();
    const navigate = useNavigate();
    const [originalProductData, setOriginalProductData] = useState(null);

    const [avisoExitosoMensaje, setAvisoExitosoMensaje] = useState('');
    const [avisoErrorMensaje, setAvisoErrorMensaje] = useState('');
    const [showModalExito, setShowModalExito] = useState(false);
    const [showModalError, setShowModalError] = useState(false);

    const handleShowModalExito = (mensaje) => {
        setAvisoExitosoMensaje(mensaje);
        setShowModalExito(true);
        navigate(`/admin/productos/detalle/${identificador}`);
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

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("authorization", token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/producto/${identificador}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setOriginalProductData(data);
                const disponibilidad = parseInt(data.disponibilidad);
                const descuento = parseInt(data.descuento);
                const precio = parseInt(data.precio);
                const precioDescuento = parseInt(data.precioDescuento);
                const habilitado = parseInt(data.habilitado);

                setFormData({
                    nombre: data.nombre,
                    marca: data.marca,
                    disponibilidad: disponibilidad,
                    descuento: descuento,
                    precio: precio,
                    precioDescuento: precioDescuento,
                    imagen: data.imagen,
                    descripcion: data.descripcion,
                    categorias: data.categorias,
                    habilitado: habilitado
                });
            })
            .catch(error => console.error('Error al obtener detalles del producto:', error));
    }, [identificador, token]);

    const [formData, setFormData] = useState({
        nombre: '',
        marca: '',
        disponibilidad: 0,
        descuento: 0,
        precio: 0,
        precioDescuento: 0,
        imagen: '',
        descripcion: '',
        categorias: [],
        habilitado: 0
    });


    const [modifiedFields, setModifiedFields] = useState({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;


        setModifiedFields({
            ...modifiedFields,
            [name]: true,
        });

        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const modificarDatos = async () => {
        const hasModifications = Object.values(modifiedFields).some((value) => value === true);
        if (hasModifications) {
            const updatedFields = {};


            for (const key in formData) {
                const value = formData[key];
                const originalValue = originalProductData[key];

                if (value !== originalValue) {

                    updatedFields[key] = !isNaN(value) ? parseInt(value) : value;
                }
            }


            var myHeaders = new Headers();
            myHeaders.append("authorization", token);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify(updatedFields);




            var requestOptions = {
                method: 'PATCH',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(`http://localhost:5000/api/producto/${identificador}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        const mensaje = data.error;
                        handleShowModalError();
                        setAvisoErrorMensaje(mensaje);
                        handleShowModalError(mensaje);
                    }
                    if (data.mensaje) {
                        setModifiedFields({});
                        const mensaje = data.mensaje;
                        handleShowModalExito();
                        setAvisoExitosoMensaje(mensaje);
                        handleShowModalExito(mensaje);
                    }

                })
                .catch(error => console.error('Error al modificar datos', error));
        } else {
            const mensaje = 'No haz hecho cambios';
            handleShowModalError();
            setAvisoErrorMensaje(mensaje);
            handleShowModalError(mensaje);
        }

    }

    return (
        <>
            {
                state.isAuthenticated ? (
                    <div className="container">
                        <br />
                        <h1>Modifica el producto</h1>
                        <div className="product-details-container">
                            <Form>
                                <div className="left-column">
                                    <Form.Group className="mb-3" controlId="nombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nombre"
                                            placeholder="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="marca">
                                        <Form.Label>Marca</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="marca"
                                            placeholder="marca"
                                            value={formData.marca}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="disponibilidad">
                                        <Form.Label>Disponibilidad</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="disponibilidad"
                                            placeholder="disponibilidad"
                                            value={formData.disponibilidad}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="descuento">
                                        <Form.Label>Descuento</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="descuento"
                                            placeholder="descuento"
                                            value={formData.descuento}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="precio">
                                        <Form.Label>Precio</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="precio"
                                            placeholder="precio"
                                            value={formData.precio}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>

                                </div>
                                <div className="right-column">
                                    <Form.Group className="mb-3" controlId="precioDescuento">
                                        <Form.Label>Precio Descuento (Lectura)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="precioDescuento"
                                            placeholder="Precio Descuento"
                                            value={formData.precioDescuento}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="imagen">
                                        <Form.Label>Imagen</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="imagen"
                                            placeholder="imagen"
                                            value={formData.imagen}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="descripcion">
                                        <Form.Label>Descripcion</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={8}
                                            name="descripcion"
                                            placeholder="descripcion"
                                            value={formData.descripcion}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="right-column2">
                                    <Form.Group className="mb-3" controlId="categorias">
                                        <Form.Label>Categorías (separar por comas)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            name="categorias"
                                            placeholder="Categorías"
                                            value={formData.categorias}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="habilitado">
                                        <Form.Label>Habilitado (1 = Si // 0 = No)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="habilitado"
                                            placeholder="habilitado"
                                            value={formData.habilitado}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </div>
                                <br />
                                <Button variant="primary" type="button" onClick={modificarDatos}>
                                    Modificar
                                </Button>
                            </Form>
                        </div>
                        <br />
                        <br />
                        <AvisoExitoso show={showModalExito} handleClose={handleCloseModalExito} mensaje={avisoExitosoMensaje}/>
                        <AvisoError show={showModalError} handleClose={handleCloseModalError} mensaje={avisoErrorMensaje} />
                    </div>
                ) : (
                    <AvisoLogin />
                )}
        </>
    );

}

export default ProductoDetalleAdmin;
