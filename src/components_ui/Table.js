import {Image} from "react-bootstrap";
import React from "react";
import {Table as BootstrapTable}  from "react-bootstrap";

function Table({body,header, tableClass}) {

    return (
        <BootstrapTable className={ tableClass ?? "table table-striped  table-hover"} variant="dark" size="sm">
            {(header && header.length > 0) ?
                <thead>
                <tr>
                    {header.map(th => <th>{th}</th>)}
                </tr>
                </thead>
                : ""}

            {(body && body.length > 0) ?
                <tbody>
                {
                    body.map(tr => {
                        return (
                            <tr>
                                {
                                    tr.map( td => {
                                    return <td>{td}</td>
                                })
                                }
                            </tr>
                        )
                    })
                }
                </tbody>
                : ""}
        </BootstrapTable>
    )
}

export default Table;