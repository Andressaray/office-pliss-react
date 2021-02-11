import React from 'react'

export default function ListDomicilios({id, empresa, fecha_domicilio, hora_i, hora_f, recargos, valor_base, valor_total, descripcion}) {
    return (
        <tr key={id}>
            <td>{ empresa }</td>
            <td>{ fecha_domicilio }</td>
            <td>{ hora_f }</td>
            <td>{ hora_i }</td>
            <td>{ recargos }</td>
            <td>{ valor_base }</td>
            <td>{ valor_total }</td>
            <td>{ descripcion }</td>
        </tr>
    )
}
