import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
// import  { modules as  ExportarExcel}            from 'react-export-excel';
import SweeAlert                                from 'sweetalert2'

import { getDomicilios, getDomiciliosFecha }  from '../../Hooks/useDomicilios';
import ListDomicilios                         from '../ListDomicilios/ListDomicilios';
import { exportExcel } from '../../Hooks/exportaExcel'

import iconExcel from '../../images/excel.png'
import './style.css'

export default function BuscarDomicilios() {

  const [domicilios, setDomicilios] = useState([]);
  const [fechaI, setFechaI]         = useState('');
  const [fechaF, setFechaF]         = useState('');
  const [domiciliosCargados, setDomiciliosCargados] = useState([])
  useEffect(() => {
    getDomicilios().then((data) => {
      setDomicilios(data);
    });
  }, []);

  const handleSubmit = async () => {
    const fechas = {
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
          getDomiciliosFecha(fechas)
            .then((data) => {
              setDomiciliosCargados(data);
              exportExcel(data);
            })
          SweeAlert.fire(
            'Excelente',
            'El reporte se esta generando, espera unos minutos o segundos!',
            'success'
          );
        }
      })
    }else{
      SweeAlert.fire({
        icon: 'success',
        title: 'Reporte generado con exito',
        text: 'El reporte puede tardar unos minutos'
      })
      getDomiciliosFecha(fechas)
      .then((data) => {
        setDomiciliosCargados(data);
        exportExcel(data);
      })
      
    }
  }

  const handleExcel = (domin) => {
    console.log('domin', domin);
    
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
            <th>Fecha Domicilio </th>
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
              domicilios.map(({id, fecha_domicilio, hora_i, hora_f, recargos, valor_base, valor_total, descripcion}) => {
                  return (
                    <ListDomicilios 
                      key={id}
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
