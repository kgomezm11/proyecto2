import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './DatosCompras.scss';
import { useAuth } from '../AuthContext/AuthContext';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import jwt_decode from 'jwt-decode';

function DatosCompras(props) {
    const { state, token } = useAuth();
    const decoded = jwt_decode(token);
    return (
        <div className="col-lg-3 col-md-4 col-sm-6 mb-4">

            {state.isAuthenticated ? (
                decoded.usuarioEncontrado.rol === 'usuario' ? (
                    <Link to={`/mis_cursos/detalle/${props.id}`} className="card-link">
                        <div className="card">
                            <img src={props.imagen} className="card-img-top mx-auto img-fluid" alt={props.titulo} />
                            <div className="card-body">
                                <p className="card-title text-center">{props.titulo}</p>
                            </div>
                            <div className="card-footer d-flex justify-content-center">
                                <Stack direction="horizontal" gap={2}>
                                    <Badge pill bg="primary">{props.categorias[0]}</Badge>
                                    <Badge pill bg="secondary">{props.categorias[1]}</Badge>
                                    <Badge pill bg="success">{props.categorias[2]}</Badge>
                                </Stack>
                            </div>
                        </div>
                    </Link>
                ) : (
                    null
                )
            ) : null}

        </div>

    );
}


export default DatosCompras;