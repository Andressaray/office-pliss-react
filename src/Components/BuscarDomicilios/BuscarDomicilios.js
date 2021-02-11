import React, { useEffect, useState } from 'react';
import { Table, Button, Form }        from 'react-bootstrap';
import SweeAlert                      from 'sweetalert2'

import { getDomicilios, getDomiciliosFecha }  from '../../Hooks/useDomicilios';
import ListDomicilios                         from '../ListDomicilios/ListDomicilios';
import { exportExcel }                        from '../../Hooks/exportaExcel'
import getEmpresas                            from '../../Hooks/useEmpresas';

import iconExcel from '../../images/excel.png'
import './style.css'

export default function BuscarDomicilios() {

  const [domicilios, setDomicilios] = useState([]);
  const [fechaI, setFechaI]         = useState('');
  const [fechaF, setFechaF]         = useState('');
  const [empresas, setEmpresas]     = useState(getEmpresas())
  const [domiciliosCargados, setDomiciliosCargados] = useState([])
  const [empresaSelected, isEmpresaSelected]        = useState('');
  const [otraEmpresa, setOtraEmpresa]               = useState('');
  useEffect(() => {
    getDomicilios().then((data) => {
      setDomicilios(data);
    });
  }, []);

  const handleSubmit = async () => {
    const argsDomicilios = {
      otraEmpresa,
      empresaSelected,
      fechaI,
      fechaF
    }
    if(!fechaI || !fechaF){
      SweeAlert.fire({
        title: 'Estas seguro?',
        text: 'Si no elijes fecha de inicio y fecha fin, te saldra el reporte general, este puede durar mucho tiempo',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si quiero'
      }).then((result) => {
        if (result.isConfirmed) {
          getDomiciliosFecha(argsDomicilios)
            .then((data) => {
              setDomiciliosCargados(data);
              if(data.status === 'info'){
                SweeAlert.fire({
                  icon: 'info',
                  title: 'Upss ...',
                  text: data.message
                })
                return 
              }else{
                exportExcel(data);
                SweeAlert.fire(
                  'Excelente',
                  'El reporte se esta generando, espera unos minutos o segundos!',
                  'success'
                );
              }
            })
        }
      })
    }else{
      getDomiciliosFecha(argsDomicilios)
      .then((data) => {
        setDomiciliosCargados(data);
        if(data.status === 'info'){
          SweeAlert.fire({
            icon: 'info',
            title: 'Upss ...',
            text: data.message
          })
          return 
        }else{
          exportExcel(data);
          SweeAlert.fire(
            'Excelente',
            'El reporte se esta generando, espera unos minutos o segundos!',
            'success'
          );
        }
      })
      
    }
  }

  return (
    <div className='mt-2'>
      <div className='d-inline-block'>
        <Form className='container-fomulario'>
          <Form.Group controlId='formBasicEmail' className='d-inline-block'>
            <Form.Label>
              <i>Fecha Inicio</i>
            </Form.Label>
            <Form.Control
              type='date'
              required
              onChange={(val) => setFechaI(val.target.value)}
            />
          </Form.Group>
          <Form.Group
            controlId='formBasicPassword'
            className='d-inline-block'
          >
            <Form.Label>
              <i>Fecha Final</i>
            </Form.Label>
            <Form.Control
              required
              type='date'
              onChange={(val) => {
                setFechaF(val.target.value);
              }}
            />
          </Form.Group>
          {
            empresas.length && (
              <Form.Group className='d-inline-block'>
                <Form.Label>
                  <i>Selecciona Empresa</i>
                </Form.Label>
                <Form.Control as='select' onChange={(text) => isEmpresaSelected(text.target.value) } custom>
                  <option value='Ninguna'>Ninguna</option>
                    {
                      empresas.map(({ id, name }) => {
                        return <option key={id} value={name}>{ name }</option>
                      })
                    }
                </Form.Control>
              </Form.Group>
            )
          }
          {
            empresaSelected === 'Otro' && (
              <Form.Group className='d-inline-block'>
                <Form.Label>
                  <i>Ingresa nombre de la empresa o del cliente</i>
                </Form.Label>
                <Form.Control 
                  type='text' 
                  placeholder='Nombre del cliente o empresa'  
                  onChange={(text) => setOtraEmpresa(text.target.value)}    
                />
              </Form.Group>
            )
          }
          <div className='button-excel'>
            <Button variant='success' className='mb-1 mr-auto' onClick={() => handleSubmit()}>
              Imprimir reporte
              <img src={iconExcel} alt={iconExcel} className='icon' />
            </Button>
          </div>
        </Form>
      </div>
      <Table responsive='xl' striped hover variant='dark' className='text-center'>
        <thead>
          <tr>
            <th>Empresa</th>
            <th>Fecha Domicilio</th>
            <th>Hora Final</th>
            <th>Hora Inicio</th>
            <th>Recargos</th>
            <th>Valor Base</th>
            <th>Valor Total</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {
            domicilios.length ? (
              domicilios.map(({id, empresa, fecha_domicilio, hora_i, hora_f, recargos, valor_base, valor_total, descripcion}) => {
                  return (
                    <ListDomicilios 
                      key={id}
                      empresa={empresa}
                      fecha_domicilio={fecha_domicilio}
                      hora_f={hora_f}
                      hora_i={hora_i}
                      recargos={recargos}
                      valor_base={valor_base}
                      valor_total={valor_total}
                      descripcion={descripcion}
                    />
                  )
                }
              )
            ):(
              <tr>
                <td colSpan={7}>No hay domicilios</td>
              </tr>
            )
          }
        </tbody>
      </Table>
    </div>
  );
}
