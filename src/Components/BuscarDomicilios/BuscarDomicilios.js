import React  from "react";
import { Form }     from "react-bootstrap";
export default function BuscarDomicilios() {
  // const [users, setUsers] = useState(saveDomicilio);
  // const [domicilios, setDomicilios] = useState([]);
  // console.log("users", users);
  return (
    <div>
      <Form>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Label>
            <i>Valor base del Domicilio</i>
          </Form.Label>
          <Form.Control type="text" placeholder="Domicilio a Buscar" />
        </Form.Group>
      </Form>
    </div>
  );
}
