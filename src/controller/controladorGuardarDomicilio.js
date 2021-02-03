import { saveDomicilio } from '../Hooks/useDomicilios'

const verificaAgregarDomicilio = async (nuevoDomicilio) => {
  let campoFaltante = '';
  console.log('nuevoDomicilio', nuevoDomicilio);
  if (nuevoDomicilio.fechaDomicilio.length === 0) {
    return campoFaltante= 'Fecha del Domiclio'
  }
  if (nuevoDomicilio.fechaInicio.length === 0) {
    return campoFaltante= 'Fecha Inicio'
  }
  if (nuevoDomicilio.fechaFin.length === 0) {
    return campoFaltante= 'Fecha Fin'  
  }
  if(!nuevoDomicilio.valorBase){
    return campoFaltante= 'Valor Base'
  }
  console.log('campoFaltante', campoFaltante);
  if(!campoFaltante){
    const response = await saveDomicilio(nuevoDomicilio)
    console.log('response', response);
    return response
  }
};

export { verificaAgregarDomicilio };
