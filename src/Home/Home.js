import React from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import AvisoLogin from '../AvisoLogin/AvisoLogin';

const Home = () => {
    const { state, usuario, rol } = useAuth();

    return (
        <div>
            {state.isAuthenticated ? (
                rol === 'usuario' ? (
                    <div className='container text-center'>
                        <br />
                        <h1>Página Principal</h1>
                        <p>Bienvenido(a), {usuario}</p>
                        <img src='httpss://cdn-icons-png.flaticon.com/512/2415/2415292.png' className="mx-auto d-block" alt="Logo de PokeAPI" />
                        <br />
                        <p>Navega entre pestañas para acceder a las distintas funcionalidades de la página.</p>
                    </div>
                ) : (
                    <div className='container text-center'>
                        <br />
                        <h1>Página Principal de Administrador</h1>
                        <p>Bienvenido(a), {usuario}</p>
                        <img src='httpss://t4.ftcdn.net/jpg/03/59/09/01/360_F_359090172_vsL1da5fNVENKKMoQTq7NSwPPrllQcRB.jpg' className="mx-auto d-block" alt="Logo de PokeAPI" />
                        <br />
                        <p>Entra al apartado de productos para gestionarlos.</p>
                    </div>
                )
            ) : (
                <AvisoLogin />
            )}
        </div>
    );
};

export default Home;
