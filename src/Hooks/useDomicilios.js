import axios from 'axios'
const URL = 'http://localhost:8080/office-pliss-react/build/controller.php'

const saveDomicilio = async (newDomicilio) => {
    const response  = await axios.post(URL, JSON.stringify(newDomicilio))
    const data      = await response
}

const getDomicilios = async () => {
    const response  = await axios.get(URL)
    const { data }  = await response
    return data
}

const getDomiciliosFecha = async (argsDomicilios) => {
    const response = await axios.post(URL, argsDomicilios)
    const { data } = await response
    return data
}

export {
    saveDomicilio,
    getDomicilios,
    getDomiciliosFecha
}