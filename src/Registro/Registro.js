import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import AvisoExitoso from '../AvisoExitoso/AvisoExitoso';
import AvisoError from '../AvisoError/AvisoError';
import './Registro.scss';

function Registro() {
    const navigate = useNavigate();

    const [avisoExitosoMensaje, setAvisoExitosoMensaje] = useState('');
    const [avisoErrorMensaje, setAvisoErrorMensaje] = useState('');
    const [showModalExito, setShowModalExito] = useState(false);
    const [showModalError, setShowModalError] = useState(false);

    const handleShowModalExito = (mensaje) => {
        setAvisoExitosoMensaje(mensaje);
        setShowModalExito(true);
        setTimeout(() => {
            navigate('/');
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
        dpi: '',
        nombres: '',
        apellidos: '',
        fechaNacimiento: '',
        direccionEntrega: '',
        nit: '',
        numeroTelefonico: '',
        correoElectronico: '',
        clave: '',
        validacionClave: '',
        rol: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const crearUsuario = () => {
        if (!formData.dpi || isNaN(formData.dpi) || formData.dpi < 1) {
            const mensaje = 'Todos los campos son requeridos';
            handleShowModalError();
            setAvisoErrorMensaje(mensaje);
            handleShowModalError(mensaje);
        }
        const updatedFields = {};

        for (const key in formData) {
            const value = formData[key];

            updatedFields[key] = !isNaN(value) ? parseInt(value) : value;

        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(updatedFields);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://proyecto1-u7g9.onrender.com/api/registro/${formData.dpi}`, requestOptions)
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
                    handleShowModalExito();
                    setAvisoExitosoMensaje(mensaje);
                    handleShowModalExito(mensaje);
                }
            })
            .catch(error => console.log('error', error));

    };

    const irLogin = () => {
        navigate('/');
    };

    const handleRoleChange = (event) => {
        const selectedRole = event.target.value;

        setFormData({
            ...formData,
            rol: selectedRole,
        });
    };


    return (
        <div className="container">
            <br />
            <h1>Ingresa tus datos</h1>
            <div className="product-details-container">
                <Form>
                    <div className="left-column">
                        <Form.Group className="mb-3" controlId="dpi">
                            <Form.Label>DPI</Form.Label>
                            <Form.Control
                                type="number"
                                name="dpi"
                                placeholder="DPI"
                                value={formData.dpi}
                                onChange={handleInputChange}
                                className="no-spinners"
                                required
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
                    <div className="right-column">
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
                        <Form.Group className="mb-3" controlId="validacionClave">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="validacionClave"
                                placeholder="Confirmar Contraseña"
                                value={formData.validacionClave}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </div>
                    <div className="right-column2">
                        <Form.Group className="mb-3" controlId="rol">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select aria-label="Rol" onChange={handleRoleChange} value={formData.rol}>
                                <option>Selecciona un tipo de usuario</option>
                                <option value="admin">Administrador</option>
                                <option value="usuario">Usuario</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <br />
                    <Button variant="primary" type="button" onClick={crearUsuario}>
                        Crear
                    </Button>
                    <br /><br />
                    <Button variant="secondary" type="button" onClick={irLogin}>
                        Regresar a Login
                    </Button>
                </Form>
            </div >
            <br />
            <br />
            <AvisoExitoso show={showModalExito} handleClose={handleCloseModalExito} mensaje={avisoExitosoMensaje} mensaje2={'Serás redireccionado...'} />
            <AvisoError show={showModalError} handleClose={handleCloseModalError} mensaje={avisoErrorMensaje} />
        </div >
    );

}

export default Registro;
