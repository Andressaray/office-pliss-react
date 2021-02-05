import React from 'react';
import { BrowserRouter as Router, 
            Switch, Route, Link }       from 'react-router-dom';
import { Container, Image }     from 'react-bootstrap';
import { FcSearch, FcBusinessContact }  from 'react-icons/fc'

import AgregarDomicilios    from '../AgregarDomicilios/AgregarDomicilios';
import BuscarDomicilios     from '../BuscarDomicilios/BuscarDomicilios';
import logo                 from '../../images/logo.png';
import './style.css';

export default function Home() {
  return (
    <Container>
        <Image src={logo} className='image-logo' />
        <Router>
            <div className='container-buttons'>
                <Link to='/AgregarDomicilio' className='links btn btn-primary'>
                    Agregar Domicilio <FcBusinessContact />
                </Link>
                <Link to='/BuscarDomicilio' className='links btn btn-warning ml-2'>
                    Buscar Domicilio <FcSearch />
                </Link>
            </div>
            <Switch>
                <Route path='/BuscarDomicilio'>
                    <BuscarDomicilios />
                </Route>
                <Route path='/AgregarDomicilio'>
                    <AgregarDomicilios />
                </Route>
            </Switch>
        </Router>
    </Container>
  );
}
