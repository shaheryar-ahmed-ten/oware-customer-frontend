import { DataGrid } from '@material-ui/data-grid';
import React from 'react'

function Inbound() {
    const columns = [
        { field: 'inwardDate', headerName: 'Inward Date', width: 200 },
        { field: 'warehouse', headerName: 'Warehouse', width: 200 },
        { field: 'product', headerName: 'Product', width: 200 },
        { field: 'quantity', headerName: 'Quantity', width: 150 },
        { field: 'referenceNumber', headerName: 'ReferenceNo', width: 200 },
    ];

    const rows = [
        { id: 1, inwardDate: '23-2-21', warehouse: 'Warehouse-Site', product: "Sugar", quantity: 150, referenceNumber: "AZG-125" },
        { id: 2, inwardDate: '23-2-21', warehouse: 'Warehouse-Site', product: "Sugar", quantity: 150, referenceNumber: "AZG-125" },
        { id: 3, inwardDate: '23-2-21', warehouse: 'Warehouse-Site', product: "Sugar", quantity: 150, referenceNumber: "AZG-125" },
        { id: 4, inwardDate: '23-2-21', warehouse: 'Warehouse-Site', product: "Sugar", quantity: 150, referenceNumber: "AZG-125" },
    ];

    return (
        <>
            
        </>
    )
}

export default Inbound
