import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Perfil.scss'
import AvisoExitoso from '../AvisoExitoso/AvisoExitoso';
import AvisoError from '../AvisoError/AvisoError';
import AvisoLogin from '../AvisoLogin/AvisoLogin';

const Perfil = () => {
    const { state, token, dispatch, rol, dpi } = useAuth();
    const navigate = useNavigate();

    const [avisoExitosoMensaje, setAvisoExitosoMensaje] = useState('');
    const [avisoErrorMensaje, setAvisoErrorMensaje] = useState('');
    const [showModalExito, setShowModalExito] = useState(false);
    const [showModalExitoEliminar, setShowModalExitoEliminar] = useState(false);
    const [showModalError, setShowModalError] = useState(false);


    const handleShowModalExito = (mensaje) => {
        setAvisoExitosoMensaje(mensaje);
        setShowModalExito(true);
    };

    const handleCloseModalExito = () => {
        setShowModalExito(false);
    };

    const handleShowModalExitoEliminar = (mensaje) => {
        setAvisoExitosoMensaje(mensaje);
        setShowModalExitoEliminar(true);
        setTimeout(() => {
            dispatch({ type: 'LOGOUT' });
            navigate('/');
        }, 2500);

    };

    const handleCloseModalExitoEliminar = () => {
        setShowModalExitoEliminar(false);
    };

    const handleShowModalError = (mensaje) => {
        setAvisoErrorMensaje(mensaje);
        setShowModalError(true);
    };

    const handleCloseModalError = () => {
        setShowModalError(false);
    };

    useEffect(() => {
        if (rol) {

            var myHeaders = new Headers();
            myHeaders.append("authorization", token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`http://localhost:5000/api/perfil/${dpi}`, requestOptions)
                .then(response => response.json())
                .then(result => {


                    const nit = parseInt(result.nit);
                    const numeroTelefonico = parseInt(result.numeroTelefonico);


                    setFormData({
                        dpi: result.dpi || '',
                        nombres: result.nombres || '',
                        apellidos: result.apellidos || '',
                        fechaNacimiento: result.fechaNacimiento || '',
                        direccionEntrega: result.direccionEntrega || '',
                        nit: nit,
                        numeroTelefonico: numeroTelefonico,
                        correoElectronico: result.correoElectronico || '',
                        clave: result.clave || '',
                        rol: result.rol || ''
                    });
                })
                .catch(error => console.error('Error al obtener datos del perfil:', error));
        }
    }, [dpi, token, rol]);

    const [formData, setFormData] = useState({
        dpi: '',
        nombres: '',
        apellidos: '',
        fechaNacimiento: '',
        direccionEntrega: '',
        nit: 0,
        numeroTelefonico: 0,
        correoElectronico: '',
        clave: ''
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
            if (rol) {

                const updatedFields = {};
                const decoded = jwt_decode(token);

                for (const key in formData) {
                    const value = formData[key];
                    const originalValue = decoded.usuarioEncontrado[key];

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

                fetch(`http://localhost:5000/api/perfil/${dpi}`, requestOptions)
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
                    .catch(error => console.error('Error al modificar datos del perfil:', error));
            }
        } else {
            const mensaje = 'No haz hecho cambios';
            handleShowModalError();
            setAvisoErrorMensaje(mensaje);
            handleShowModalError(mensaje);
        }

    }

    const irHome = () => {
        navigate('/home');
    };


    const eliminarPerfil = () => {
        var myHeaders = new Headers();
        myHeaders.append("authorization", token);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/perfil/${dpi}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    const mensaje = data.error;
                    handleShowModalError();
                    setAvisoErrorMensaje(mensaje);
                    handleShowModalError(mensaje);
                }
                if (data.mensaje) {
                    const mensaje = data.mensaje;
                    handleShowModalExitoEliminar();
                    setAvisoExitosoMensaje(mensaje);
                    handleShowModalExitoEliminar(mensaje);

                }

            })
            .catch(error => console.log('error', error));
    };

    return (
        <div>
            {
                state.isAuthenticated ? (
                    <div className="container">

                        <br />
                        <h1>Modifica tu perfil</h1>
                        <div className="product-details-container">
                            <Form>
                                <div className="left-column">
                                    <Form.Group className="mb-3" controlId="dpi">
                                        <Form.Label>DPI (lectura) </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="dpi"
                                            placeholder="DPI"
                                            value={formData.dpi}
                                            onChange={handleInputChange}
                                            className="no-spinners"
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="nombres">
                                        <Form.Label>Nombres</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nombres"
                                            placeholder="Nombres"
                                            value={formData.nombres}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="apellidos">
                                        <Form.Label>Apellidos</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="apellidos"
                                            placeholder="Apellidos"
                                            value={formData.apellidos}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="fechaNacimiento">
                                        <Form.Label>Fecha de Nacimiento</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="fechaNacimiento"
                                            placeholder="Fecha Nacimiento"
                                            value={formData.fechaNacimiento}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="direccionEntrega">
                                        <Form.Label>Dirección Entrega</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="direccionEntrega"
                                            placeholder="Dirección Entrega"
                                            value={formData.direccionEntrega}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>

                                </div>
                                <div className="right-column2">
                                    <Form.Group className="mb-3" controlId="nit">
                                        <Form.Label>Nit</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="nit"
                                            placeholder="Nit"
                                            value={formData.nit}
                                            onChange={handleInputChange}
                                            className="no-spinners"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="numeroTelefonico">
                                        <Form.Label>Número Telefonico</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="numeroTelefonico"
                                            placeholder="Número Telefonico"
                                            value={formData.numeroTelefonico}
                                            onChange={handleInputChange}
                                            className="no-spinners"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="correoElectronico">
                                        <Form.Label>Correo Electronico</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="correoElectronico"
                                            placeholder="Correo Electronico"
                                            value={formData.correoElectronico}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="clave">
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="clave"
                                            placeholder="Contraseña"
                                            value={formData.clave}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="rol">
                                        <Form.Label>Rol (lectura)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="rol"
                                            placeholder="Rol"
                                            value={formData.rol}
                                            onChange={handleInputChange}
                                            readOnly
                                        />
                                    </Form.Group>
                                </div>
                                <div className="right-column2" style={{ marginTop: '30px' }}>
                                    <Button variant="primary" type="button" onClick={modificarDatos}>
                                        Modificar
                                    </Button>
                                    <Button variant="danger" type="button" onClick={eliminarPerfil}>
                                        Eliminar
                                    </Button>
                                    <br />
                                    <br />
                                    <Button variant="secondary" type="button" onClick={irHome}>
                                        Regresar a Pantalla Principal
                                    </Button>
                                </div>
                                <br />

                            </Form>
                        </div >
                        <br />
                        <br />
                        <AvisoExitoso show={showModalExito} handleClose={handleCloseModalExito} mensaje={avisoExitosoMensaje} />
                        <AvisoExitoso show={showModalExitoEliminar} handleClose={handleCloseModalExitoEliminar} mensaje={avisoExitosoMensaje} mensaje2={'Serás redireccionado...'} />
                        <AvisoError show={showModalError} handleClose={handleCloseModalError} mensaje={avisoErrorMensaje} />
                    </div >
                ) : (
                    <AvisoLogin />
                )}
        </div>
    );
};

export default Perfil;
