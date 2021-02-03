const URL = 'http://localhost:8080/office-pliss-react/src/backend/controller.php'
const saveDomicilio = (newDomicilio) => {
    console.log('newDomicilio', newDomicilio);
    fetch(URL, {
        method: 'POST',
        mode: 'cors',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        data: JSON.stringify(newDomicilio),
    }).then((response) => {
        console.log('response', response);
    }).catch((e) => {
        console.log('e', e);
    })
    // const response = await axios.post(URL, newDomicilio)
    // const data = await response
    // console.log('data', data);
}

const useGetDomicilios = async () => {

}

export {
    saveDomicilio,
    useGetDomicilios
}