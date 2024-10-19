import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatosCompras from '../DatosCompras/DatosCompras';
import AvisoLogin from '../AvisoLogin/AvisoLogin';
import SelectorCategorias from '../SelectorCategorias/SelectorCategorias';

function ComprasHistorial() {
    const { state, rol, token, dpi } = useAuth();
    const [productosInfo, setProductosInfo] = useState([]);
    const [productosInfo2, setProductosInfo2] = useState([]);
    const [totalTokens, setTotalTokens] = useState(0); // Estado para el total de tokens

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("authorization", token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://proyecto1-u7g9.onrender.com/api/compra", requestOptions)
            .then(response => response.json())
            .then(data => {
                // Verificar si 'data' es un array o un objeto
                if (Array.isArray(data)) {
                    setProductosInfo(data);
                    setProductosInfo2(data);
                } else if (typeof data === 'object' && data !== null) {
                    // Si es un objeto, lo convertimos en un array con un solo elemento
                    setProductosInfo([data]);
                    setProductosInfo2([data]);
                } else {
                    console.error('La respuesta no es válida:', data);
                    setProductosInfo([]); // Setea un array vacío si la respuesta no es válida
                }
                const total = (Array.isArray(data) ? data : [data]).reduce((acc, producto) => {
                    return acc + (producto.tokens || 0);  // Sumar tokens, o 0 si no existe el campo
                }, 0);
                setTotalTokens(total);
                console.log(data);
            })
            .catch(error => console.error('Error al obtener productos:', error));
    }, [rol, token]);


    // Genera un conjunto único de categorías
    const allCategories = [...new Set(Array.isArray(productosInfo) ? productosInfo.flatMap((producto) => producto.categorias) : [])];

    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
    };

    return (
        <>
            {
                state.isAuthenticated ? (
                    <div className="container">
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
                        <h1>Historial de cursos adquiridos</h1>
                        <br />

                        <div className="row">
                            {productosInfo.length > 0 ? (
                                productosInfo
                                    .filter((producto) => {
                                        if (selectedCategory === 'Todos') {
                                            return true;
                                        }
                                        return producto.categorias.includes(selectedCategory);
                                    })
                                    .map((producto) => {
                                        // Determinar el id a pasar como prop
                                        const idToPass = producto.id2 ? producto.id2 : producto._id;

                                        return (
                                            <DatosCompras
                                                key={idToPass} // Usamos idToPass como key
                                                id={idToPass} // Pasamos el id determinado
                                                titulo={producto.titulo} // Manejo de errores en campos faltantes
                                                imagen={producto.imagen} // Imagen por defecto
                                                categorias={producto.categorias?.slice(0, 3)} // Asegura que categorias esté definido
                                                tokens={producto.tokens}  // Pasamos tokensGastados como prop
                                            />
                                        );
                                    })
                            ) : (
                                <p>No se encontraron cursos.</p>
                            )}
                        </div>
                        <h4>Total histórico de tokens: {totalTokens} </h4>
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

export default ComprasHistorial;
