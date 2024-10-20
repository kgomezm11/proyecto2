import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Datos from '../Datos/Datos';
import AvisoLogin from '../AvisoLogin/AvisoLogin';
import SelectorCategorias from '../SelectorCategorias/SelectorCategorias';

function Productos() {
    const { state, rol, token, dpi } = useAuth();
    const [productosInfo, setProductosInfo] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("authorization", token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://proyecto1-u7g9.onrender.com/api/cursos", requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setProductosInfo(data);
            })
            .catch(error => console.error('Error al obtener productos:', error));
    }, [rol, token]);

    const allCategories = [...new Set(productosInfo.flatMap((producto) => producto.categorias))];

    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
    };

    const irNuevoProducto = async () => {
        navigate('/cursos/nuevo');
    };

    return (
        <>
            {
                state.isAuthenticated ? (
                    <div className="container">
                        <br />
                        <Button className='float-end btn-custom' variant="primary" type="button" onClick={irNuevoProducto}>
                            Crear producto
                        </Button>
                        <br />
                        <br />
                        <div>
                            <h3>Selecciona una categoría:</h3>
                            <SelectorCategorias
                                categories={[...allCategories]}
                                selectedCategory={selectedCategory}
                                onChange={handleSelectCategory}
                            />
                        </div>
                        <br />
                        <h1>Lista de cursos</h1>
                        <br />
                        <div className="row">
                            {productosInfo
                                .filter((producto) => {

                                    if (selectedCategory === 'Todos') {
                                        return true;
                                    }

                                    return producto.categorias.includes(selectedCategory);
                                })
                                .map((producto) => (
                                    producto.usuario[0].dpi_usuario !== dpi ? (
                                        <Datos
                                            key={producto._id}
                                            id={producto._id}
                                            nombre={producto.titulo}
                                            imagen={producto.imagen}
                                            categorias={producto.categorias.slice(0, 3)}
                                        />
                                    ) : null
                                ))
                            }
                        </div>
                        <br />
                        <br />
                        <br />
                    </div>
                ) : (
                    <AvisoLogin />
                )}
        </>
    );
}

export default Productos;
