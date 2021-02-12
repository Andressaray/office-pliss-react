import React, { useState }  from 'react';
import { Form, Button }     from 'react-bootstrap';
import SweetAlert           from 'sweetalert2';

import getEmpresas                  from '../../Hooks/useEmpresas';
import { verificaAgregarDomicilio } from '../../controller/controladorGuardarDomicilio'
import './style.css';

export default function AgregarDomicilios() {
  const [fechaDomicilio, setFechaDomicilio]             = useState([]);
  const [fechaInicio, setFechaInicio]                   = useState([]);
  const [fechaFin, setFechaFin]                         = useState([]);
  const [valorBase, setValorBase]                       = useState(0);
  const [cantidadRecargos, setCantidadRecargos]         = useState(0);
  const [valorTotal, setValorTotal]                     = useState(0);
  const [descripcionDomicilio, setDescripcionDomicilio] = useState('');
  const [empresas, setEmpresas]                         = useState(getEmpresas())
  const [otraEmpresa, setOtraEmpresa]                   = useState('');
  const [empresaSelected, isEmpresaSelected]            = useState('Ninguna');

  const handleReset = () => {
    document.getElementById('reset').click()
  }

  const calcularRecargos = () => {
    if (fechaInicio.length === 0 || fechaFin.length === 0) {
      SweetAlert.fire({
        icon: 'info',
        text: 'Tienes que ingresar la hora de inicio y la hora fin',
      });
      return false;
    } else {
      let recargosMinutos     = 0;
      let recargosHoras       = 0;
      let recargosMinutosPrev = 0;
      let recargosHorasPrev   = 0;
      let totalRecargos       = 0;
      let recargosMinutosAft  = 0;
      const valorRecargo      = (valorBase * 0.75);
      let fechaI              = fechaInicio.split(':').map((inicio) => parseInt(inicio));
      let fechaF              = fechaFin.split(':').map((fin) => parseInt(fin));
      if (fechaF[1] >= fechaI[1]) {
        recargosHorasPrev   = parseInt(((fechaF[0] - fechaI[0]) * 2));
        recargosHoras       = recargosHorasPrev === 0 ? 0 : recargosHorasPrev - 1;
        recargosMinutosPrev = fechaF[1]-fechaI[1];
        if(fechaF[0] === fechaI[0]){
          recargosMinutos     = recargosMinutosPrev <= 30 ? 0 :1;  
        }
        else {recargosMinutos     = fechaF[1] > fechaI[1] ? 1 : 0;}
        console.log('recargosMinutosPrev', recargosMinutosPrev)
        console.log('recargosMinutos', recargosMinutos);
        totalRecargos       = recargosHoras + recargosMinutos;
        setCantidadRecargos(totalRecargos);
        setValorTotal(valorBase + (totalRecargos * valorRecargo));
      }
      else{
        recargosHorasPrev   = parseInt((fechaF[0] - fechaI[0]) * 2);
        recargosHoras       = recargosHorasPrev === 2 ? -1 : recargosHorasPrev;
        if(recargosHoras !== -1){
          let recargosHorasAft  = recargosHorasPrev - 2;
          recargosMinutosPrev   = ((60-fechaI[1])+ fechaF[1]);
          console.log('recargosMinutosPrev', recargosMinutosPrev);
          console.log('recargosHorasPrev/30', recargosMinutosPrev/30);
          recargosMinutosAft    =  recargosMinutosPrev/30 <= 1 ? 1 : 2;
          totalRecargos         = (recargosHorasAft + recargosMinutosAft)-1;
          setCantidadRecargos(totalRecargos);
          setValorTotal(valorBase + (totalRecargos * valorRecargo));
        }else{
          recargosMinutosPrev = ((60-fechaI[1]) + fechaF[1])
          recargosMinutos     = recargosMinutosPrev/30 === 1 ? 1 : recargosMinutosPrev /30 > 1 ? 2 : 1;
          totalRecargos       = (recargosHoras + recargosMinutos);
          setCantidadRecargos(totalRecargos);
          setValorTotal(valorBase + (totalRecargos * valorRecargo));
        }
      }
    }
  };

  const handleSubmit = async  () => {
    if(fechaInicio > fechaFin){
      SweetAlert.fire({
        icon: 'info',
        title: 'Ingresaste algo mal',
        text: 'La fecha Inicio es mayor a Fecha Final'
      })
      return
    }
    const nuevoDomicilio = {
      fechaDomicilio,
      fechaInicio,
      fechaFin,
      valorBase,
      valorTotal,
      cantidadRecargos,
      descripcionDomicilio,
      empresaSelected,
      otraEmpresa

    };
    const campoFaltante = await verificaAgregarDomicilio(nuevoDomicilio);
    if(campoFaltante){
      SweetAlert.fire({
        icon: 'info',
        text: `Falta llenar el campo ${campoFaltante}`
      })
    }else{
      SweetAlert.fire({
        icon: 'success',
        title: 'Exito',
        text: 'Se ha guardado el domicilio con exito'
      });
      setCantidadRecargos(0);
      setValorTotal(0);
      setDescripcionDomicilio('');
      setFechaFin('');
      setFechaInicio('');
      setValorBase(0);
      handleReset();
    }
  };
  return (
    <div className='container-domicilios mb-3'>
      <h3 className='text-center'>Crear Domicilio</h3>
      <hr />
      <Form className='container-fomulario'>
        {
            empresas.length && (
              <Form.Group className='d-inline-block'>
                <Form.Label>
                  <i>Seleccionar Empresa</i>
                </Form.Label>
                <Form.Control as='select' onChange={(text) => {
                  isEmpresaSelected(text.target.value)
                } } custom>
                  <option value='Ninguna'>Debes seleccionar</option>
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
        <Form.Group controlId='formBasicEmail' className='d-inline-block'>
          <Form.Label>
            <i>Fecha del Domicilio</i>
          </Form.Label>
          <Form.Control
            type='date'
            required
            onChange={(val) => setFechaDomicilio(val.target.value)}
          />
        </Form.Group>
        <Form.Group
          controlId='formBasicPassword'
          className='d-inline-block'
        >
          <Form.Label>
            <i>Hora Inicio</i>
          </Form.Label>
          <Form.Control
            required
            type='time'
            onChange={(val) => {
              setFechaInicio(val.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId='formBasicPassword' className='d-inline-block'>
          <Form.Label>
            <i>Hora Fin</i>
          </Form.Label>
          <Form.Control
            required
            type='time'
            onChange={(value) => {
              setFechaFin(value.target.value);
            }}
          />
        </Form.Group>
        {fechaInicio > fechaFin && fechaFin !== 0 && (
            <div className='text-center mb-3'>
              <span className='alert alert-danger'>
                La fecha de inicio no puede ser mayor a la de fin
              </span>
            </div>
          )
          
        }
        <Form.Group controlId='formBasicCheckbox' className='d-inline-block'>
          <Form.Label>
            <i>Valor base del Domicilio</i>
          </Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Valor base del domicilio'
            pattern='[0-9]*'
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                SweetAlert.fire({
                  icon: 'info',
                  text: 'Debes ingresar números, no letras'
                })
                event.preventDefault();
              }
            }}
            onChange={(val) => setValorBase(parseInt(val.target.value))}
          />
        </Form.Group>
        <Form.Group controlId='formBasicCheckbox' className='d-inline-block'>
          <Form.Label>
            <i>Valor total del Domicilio</i>
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Valor total de Domicilio'
            readOnly
            value={valorTotal}
          />
        </Form.Group>
        <Form.Group controlId='formBasicCheckbox' className='d-inline-block'>
          <Form.Label>
            <i>Cantidad de Recargos</i>
          </Form.Label>
          <Form.Control
            type='text'
            className='form-group'
            placeholder='Cantidad de Recargos'
            value={cantidadRecargos}
            readOnly
          />
        </Form.Group>
        <div className='text-center'>
            <button
              type='button'
              className='btn btn-dark'
              onClick={() => calcularRecargos()}
            >
              Calcular Valor del Domicilio
            </button>
          </div>
        <br />
        <Form.Group controlId='exampleForm.ControlTextarea1' className='col-md-6 pl-0'>
          <Form.Control
            as='textarea'
            placeholder='Descripción del dominicilio'
            rows={3}
            className='text-area'
            onChange={(val) => setDescripcionDomicilio(val.target.value)}
          />
        </Form.Group>
        <div className='container-buttons'>
          <div className='text-center mr-2'>
            <Button 
              id='reset' 
              variant='secondary' 
              className='button mb-2' 
              type='reset' 
              onClick={() => handleReset()}
              >
                Limpiar
              </Button>
          </div>
          <div className='text-center'>
            <Button
                variant='info'
                type='button'
                className='button mb-2 mr-2'
                onClick={() => handleSubmit()}
              >
                Crear Domicilio
              </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
