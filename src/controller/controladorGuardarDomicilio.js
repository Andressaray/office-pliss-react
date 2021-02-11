import { saveDomicilio } from '../Hooks/useDomicilios'

const verificaAgregarDomicilio = async (nuevoDomicilio) => {
  let campoFaltante = '';
  if(!nuevoDomicilio.empresaSelected) {
    return campoFaltante = 'Empresa'
  }
  if(!nuevoDomicilio.otraEmpresa && !nuevoDomicilio.empresaSelected) {
    return campoFaltante = 'escribir la otra empresa'
  }
  if (nuevoDomicilio.fechaDomicilio.length === 0) {
    return campoFaltante = 'Fecha del Domiclio'
  }
  if (nuevoDomicilio.fechaInicio.length === 0) {
    return campoFaltante = 'Fecha Inicio'
  }
  if (nuevoDomicilio.fechaFin.length === 0) {
    return campoFaltante = 'Fecha Fin'  
  }
  if(!nuevoDomicilio.valorBase) {
    return campoFaltante = 'Valor Base'
  }
  if(!campoFaltante){
    const response = await saveDomicilio(nuevoDomicilio)
    return response
  }
};

export { verificaAgregarDomicilio };
