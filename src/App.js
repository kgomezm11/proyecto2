import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext/AuthContext';
import Login from './Login/Login';
import Home from './Home/Home';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import './App.scss';
import Perfil from './Perfil/Perfil';
import Productos from './Productos/Productos';
import ProductoDetalleAdquirido from './ProductoDetalleAdquirido/ProductoDetalleAdquirido';
import ProductoDetalle from './ProductoDetalle/ProductoDetalle';
import ProductosAdmin from './ProductosAdmin/ProductosAdmin';
import ProductoDetalleAdmin from './ProductoDetalleAdmin/ProductoDetalleAdmin';
import ProductosNuevo from './ProductosNuevo/ProductosNuevo';
import Registro from './Registro/Registro';
import ComprasHistorial from './ComprasHistorial/ComprasHistorial';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/cursos" element={<Productos />} />
          <Route path="/mis_cursos" element={<ComprasHistorial />} />
          <Route path="/cursos/detalle/:_id" element={<ProductoDetalle />} />
          <Route path="/admin/productos" element={<ProductosAdmin />} />
          <Route path="/admin/productos/detalle/:id" element={<ProductoDetalleAdmin />} />
          <Route path="/cursos/nuevo" element={<ProductosNuevo />} />
          <Route path="/mis_cursos/detalle/:_id" element={<ProductoDetalleAdquirido />} />
        </Routes>
        <Footer></Footer>
      </Router>
    </AuthProvider>
  );
};

export default App;