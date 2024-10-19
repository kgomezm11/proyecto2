import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { useAuth } from '../AuthContext/AuthContext';
import { NavLink } from 'react-router-dom';
import CarritoModal from '../CarritoModal/CarritoModal';
import { useNavigate } from 'react-router-dom';

import "./Header.scss";

function Header() {
    const { dispatch, state, token, rol, tokensU } = useAuth();
    const [showCarritoModal, setShowCarritoModal] = useState(false);
    const [carritoData, setCarritoData] = useState(null);
    const navigate = useNavigate();

    const handleShowCarritoModal = () => {
        if (state.isAuthenticated) {
            var myHeaders = new Headers();
            myHeaders.append("authorization", token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("http://proyecto1-u7g9.onrender.com/api/carrito", requestOptions)
                .then(response => response.json())
                .then(data => {
                    setCarritoData(data);
                    setShowCarritoModal(true);
                })
                .catch(error => console.log('Error al obtener datos del carrito:', error));
        }
    };

    const handleCloseCarritoModal = () => {
        setShowCarritoModal(false);
    };

    useEffect(() => {
        if (state.isAuthenticated) {

            var myHeaders = new Headers();
            myHeaders.append("authorization", token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("http://proyecto1-u7g9.onrender.com/api/carrito", requestOptions)
                .then(response => response.json())
                .then(data => {
                    setCarritoData(data);
                })
                .catch(error => console.log('Error al obtener datos del carrito:', error));
        }
    }, [state.isAuthenticated, token]);

    const cerrarSesion = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    }

    return (
        <Navbar className='navbar-custom' expand="lg">
            <Container>
                <Navbar.Brand>Tienda en Línea</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {state.isAuthenticated ? (
                        rol === 'usuario' ? (
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <NavLink
                                        to="/home"
                                        className="nav-link rounded-pill btn btn-dark mx-2"
                                        activeClassName="active"
                                    >
                                        Inicio
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/perfil"
                                        className="nav-link rounded-pill btn btn-dark mx-2"
                                        activeClassName="active"
                                    >
                                        Perfil
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/cursos"
                                        className="nav-link rounded-pill btn btn-dark mx-2"
                                        activeClassName="active"
                                    >
                                        Cursos
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/mis_cursos"
                                        className="nav-link rounded-pill btn btn-dark mx-2"
                                        activeClassName="active"
                                    >
                                        Mis cursos
                                    </NavLink>
                                </li>
                            </ul>
                        ) : (
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <NavLink
                                        to="/admin/home"
                                        className="nav-link rounded-pill btn btn-dark mx-2"
                                        activeClassName="active"
                                    >
                                        Inicio
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/admin/productos"
                                        className="nav-link rounded-pill btn btn-dark mx-2"
                                        activeClassName="active"
                                    >
                                        Cursos
                                    </NavLink>
                                </li>
                            </ul>
                        )
                    ) : null}

                    {state.isAuthenticated ? (
                        rol === 'usuario' ? (
                            <>
                                <Navbar.Text>
                                    <Button variant="success" className="button-spacing" >
                                        Tus tokens: {tokensU}
                                    </Button>
                                </Navbar.Text>
                                <Navbar.Text>
                                    <Button variant="danger" className="button-spacing" onClick={cerrarSesion}>Cerrar Sesión</Button>
                                </Navbar.Text>

                                <CarritoModal show={showCarritoModal} onHide={handleCloseCarritoModal} carritoData={carritoData} />
                            </>
                        ) : (
                            <Navbar.Text>
                                <Button variant="danger" className="button-spacing" onClick={cerrarSesion}>Cerrar Sesión</Button>
                            </Navbar.Text>
                        )
                    ) : null}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
