import React, { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import jwt_decode from 'jwt-decode';
import AvisoError from '../AvisoError/AvisoError';

const Login = () => {
    const [showModal, setShowModal] = useState(false);
    const [avisoErrorMensaje, setAvisoErrorMensaje] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { dispatch, setUsuario, setToken, setRol, setDpi, setTokensU } = useAuth();
    const navigate = useNavigate();

    const handleShowModal = (mensaje) => {
        setAvisoErrorMensaje(mensaje);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLogin = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            correoElectronico: email,
            clave: password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://proyecto1-u7g9.onrender.com//api/login", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    const mensaje = data.error;
                    handleShowModal();
                    setAvisoErrorMensaje(mensaje);
                    handleShowModal(mensaje);
                }

                if (data.token) {

                    const decoded = jwt_decode(data.token);
                    try {
                        if (decoded.usuarioEncontrado.rol === 'admin') {

                            setToken(data.token.toString())
                            setRol(decoded.usuarioEncontrado.rol)
                            setUsuario(email);
                            setDpi(decoded.usuarioEncontrado.dpi);
                            setTokensU(decoded.usuarioEncontrado.tokens)
                            dispatch({ type: 'LOGIN' });
                            navigate('/admin/home');
                        } else if (decoded.usuarioEncontrado.rol === 'usuario') {
                            setToken(data.token.toString())
                            setUsuario(email);
                            setRol('usuario')
                            setDpi(decoded.usuarioEncontrado.dpi);
                            setTokensU(decoded.usuarioEncontrado.tokens)
                            dispatch({ type: 'LOGIN' });
                            navigate('/home');
                        }


                    } catch (error) {
                        console.error('Error al decodificar el JWT:', error);
                    }
                } else {

                }
            })
            .catch(error => console.log('error', error));
    };

    const irRegistro = async () => {
        navigate('/registro');
    };


    return (
        <>
            <br />
            <br />
            <br />
            <p><center>Nota: luego de la primer solicitud (login o registro) la API en render demora unos 20 segundos en iniciarse</center></p>
            <p><center>http://proyecto1-u7g9.onrender.com//</center></p>
            <Card style={{ width: '18rem', height: '18rem' }} className="container mt-3">

                <Card.Body>
                    <Card.Title>Login</Card.Title>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Correo
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            placeholder="Correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </Card.Body>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                        handleLogin();
                    }}
                >
                    Iniciar sesión
                </button>
                <br /><br /><br />
                <label htmlFor="nuevoUsuario" className="form-label text-center">
                    Crea una cuenta acá
                </label>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={irRegistro}
                >
                    Registrarse
                </button>
            </Card>
            <AvisoError show={showModal} handleClose={handleCloseModal} mensaje={avisoErrorMensaje} />

        </>

    );
};

export default Login;
