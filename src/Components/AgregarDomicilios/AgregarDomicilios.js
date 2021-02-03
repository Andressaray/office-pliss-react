import React, { useState } from "react";
import { Form, Button }    from "react-bootstrap";
import SweetAlert         from "sweetalert2";

import { verificaAgregarDomicilio } from '../../controller/controladorGuardarDomicilio'
import "./style.css";

export default function AgregarDomicilios() {
  const [fechaDomicilio, setFechaDomicilio]     = useState([]);
  const [fechaInicio, setFechaInicio]           = useState([]);
  const [fechaFin, setFechaFin]                 = useState([]);
  const [valorBase, setValorBase]               = useState(0);
  const [cantidadRecargos, setCantidadRecargos] = useState(0);
  const [valorTotal, setValorTotal]             = useState(0);
  const [descripcionDomicilio, setDescripcionDomicilio] = useState('');

  const calcularRecargos = () => {
    if (fechaInicio.length === 0 || fechaFin.length === 0) {
      SweetAlert.fire({
        icon: "info",
        text: "Tienes que ingresar la hora de inicio y la hora fin",
      });
      return false;
    } else {
      let recargosMinutos   = 0;
      let recargosHoras     = 0;
      let recargosHorasPrev = 0;
      let totalRecargos     = 0;
      const valorRecargo    = (valorBase * 0.75);
      let fechaI            = fechaInicio.split(":").map((inicio) => parseInt(inicio));
      let fechaF            = fechaFin.split(":").map((fin) => parseInt(fin));
      if (fechaF[1] >= fechaI[1]) {
        recargosHorasPrev = parseInt(((fechaF[0] - fechaI[0]) * 2));
        recargosHoras     = recargosHorasPrev === 0 ? 0 : recargosHorasPrev - 1; 
        recargosMinutos   = fechaF[1] !== fechaI[1] ? parseInt((fechaF[1]-fechaI[1]) / 30): 0;
        totalRecargos     = recargosHoras + recargosMinutos;
        setCantidadRecargos(totalRecargos);
        setValorTotal(valorBase + (totalRecargos * valorRecargo));
      }
      else{
        recargosHoras     = parseInt((fechaF[0] - fechaI[0]) * 2);
        recargosMinutos   = parseInt(((60 - fechaI[1]) - fechaF[1]) / 30);
        totalRecargos     = (recargosHoras + recargosMinutos) - 2;
        setCantidadRecargos(totalRecargos);
        setValorTotal(valorBase + (cantidadRecargos * valorRecargo));
      }
    }
  };

  const handleSubmit = async  () => {
    const nuevoDomicilio = {
      fechaDomicilio,
      fechaInicio,
      fechaFin,
      valorBase,
      cantidadRecargos,
      descripcionDomicilio
    };
    const campoFaltante = await verificaAgregarDomicilio(nuevoDomicilio);
    if(campoFaltante){
      SweetAlert.fire({
        icon: 'info',
        text: `Falta llenar el campo ${campoFaltante}`
      })
    }
  };
  return (
    <div className="container-domicilios mb-3">
      <h3 className="text-center">Crear Domicilio</h3>
      <hr />
      <Form className="container-fomulario">
        <Form.Group
          controlId="exampleForm.ControlSelect1"
          className="d-inline-block"
        >
          <Form.Label>
            <i>Empresas</i>
          </Form.Label>
          <Form.Control as="select" required>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formBasicEmail" className="d-inline-block">
          <Form.Label>
            <i>Fecha del Domicilio</i>
          </Form.Label>
          <Form.Control
            type="date"
            required
            onChange={(val) => setFechaDomicilio(val.target.value)}
          />
        </Form.Group>
        <Form.Group
          controlId="formBasicPassword"
          className="d-inline-block"
        >
          <Form.Label>
            <i>Hora Inicio</i>
          </Form.Label>
          <Form.Control
            required
            type="time"
            onChange={(val) => {
              setFechaInicio(val.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword" className="d-inline-block">
          <Form.Label>
            <i>Hora Fin</i>
          </Form.Label>
          <Form.Control
            required
            type="time"
            onChange={(value) => {
              setFechaFin(value.target.value);
            }}
          />
        </Form.Group>
        {fechaInicio > fechaFin && fechaFin !== 0 && (
            <div className="text-center mb-3">
              <span className="alert alert-danger">
              La fecha de inicio no puede ser mayor a la de fin
              </span>
            </div>
          )}
        <Form.Group controlId="formBasicCheckbox" className="d-inline-block">
          <Form.Label>
            <i>Valor base del Domicilio</i>
          </Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Valor base del domicilio"
            pattern="[0-9]*"
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
        <Form.Group controlId="formBasicCheckbox" className="d-inline-block">
          <Form.Label>
            <i>Valor total del Domicilio</i>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Valor total de Domicilio"
            readOnly
            value={valorTotal}
          />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox" className="d-inline-block">
          <Form.Label>
            <i>Cantidad de Recargos</i>
          </Form.Label>
          <Form.Control
            type="text"
            className="form-group"
            placeholder="Cantidad de Recargos"
            value={cantidadRecargos}
            readOnly
          />
        </Form.Group>
        <div className="text-center">
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => calcularRecargos()}
            >
              Calcular Valor del Domicilio
            </button>
          </div>
        <br />
        <Form.Group controlId="exampleForm.ControlTextarea1" className="mr-auto">
          <Form.Control
            as="textarea"
            placeholder="Descripción del dominicilio"
            rows={3}
            className="text-area"
            onChange={(val) => setDescripcionDomicilio(val.target.value)}
          />
        </Form.Group>
        <div className="text-center">
          <Button
            variant="info"
            type="button"
            className="button mb-2"
            onClick={() => handleSubmit()}
          >
            Crear Domicilio
          </Button>
        </div>
      </Form>
    </div>
  );
}
