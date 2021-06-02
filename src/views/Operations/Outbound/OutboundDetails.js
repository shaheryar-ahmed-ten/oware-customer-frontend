import { Dialog, DialogContent, DialogTitle, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import TableHeader from '../../../components/TableHeader';
import { dateFormat, getURL } from '../../../utils/common';


const useStyles = makeStyles({
    tableContainerTop: {
        backgroundColor: '#E5E5E5'
    },
    tableContainer: {
        backgroundColor: 'white'
    }
});
function OutboundDetails({ open, handleClose, selectedOutboundOrder }) {
    const classes = useStyles()
    const columnsTop = [
        {
            id: 'product',
            label: 'PRODUCT',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'warehouse',
            label: 'WAREHOUSE',
            minWidth: 'auto',
            className: '',
        },
    ]
    const columns = [
        {
            id: 'createdAt',
            label: 'DISPATCH DATE',
            minWidth: 'auto',
            className: '',
            format: dateFormat
        },
        {
            id: 'Vehicle.number',
            label: 'VEHICLE',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.Vehicle.number,
        },
        {
            id: 'Vehicle.type',
            label: 'VEHICLE TYPE',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.Vehicle.type,
        },
        {
            id: 'quantity',
            label: 'QUANTITY SHIPPED',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'receiverName',
            label: 'RECEIVER NAME',
            minWidth: 'auto',
            className: '',
            format: (value, entity, outwardOrder) => outwardOrder.receiverName
        },
        {
            id: 'receiverPhone',
            label: 'RECEIVER PHONE',
            minWidth: 'auto',
            className: '',
            format: (value, entity, outwardOrder) => outwardOrder.receiverPhone
        }
    ]

    const [selectedProductOutwardDetails, setSelectedProductOutwardDetails] = useState([])
    useEffect(() => {
        if (selectedOutboundOrder)
            axios.get(getURL(`/order/${selectedOutboundOrder.id}`))
                .then((response) => {
                    setSelectedProductOutwardDetails(response.data.data)
                })
                .catch((err) => {
                    console.log(err)
                })

    }, [selectedOutboundOrder])

    return (
        selectedOutboundOrder ?
            <div style={{ display: "inline" }}>
                <form>
                    <Dialog open={open} onClose={handleClose} maxWidth="lg"  aria-labelledby="form-dialog-title">
                        <DialogContent>
                            <TableContainer className={classes.tableContainerTop}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        {columnsTop.map((column, index) => (
                                            <TableCell
                                                key={index}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth, background: 'transparent', fontWeight: 'bolder', fontSize: '14px', color: '#939393' }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableHead>
                                    <TableBody>
                                        <TableRow hover role="checkbox" tabIndex={-1} key={selectedOutboundOrder.id}>
                                            {columnsTop.map((column) => {
                                                const value = selectedOutboundOrder[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}
                                                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                        {column.format ? column.format(value, selectedOutboundOrder) : (value || '')}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TableContainer className={classes.tableContainer}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        {columns.map((column, index) => (
                                            <TableCell
                                                key={index}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth, background: 'transparent', fontWeight: 'bolder', fontSize: '14px', color: '#939393' }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableHead>
                                    <TableBody>
                                        {
                                            selectedProductOutwardDetails.map((outwardOrder) => {
                                                return outwardOrder.ProductOutwards.map((productOutward) => {
                                                    return (
                                                        <TableRow hover role="checkbox" tabIndex={-1} key={productOutward.id}>
                                                            {columns.map((column) => {
                                                                const value = productOutward[column.id];
                                                                return (
                                                                    <TableCell key={column.id} align={column.align}
                                                                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                                        {column.format ? column.format(value, productOutward, outwardOrder) : (value || '')}
                                                                    </TableCell>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    )
                                                })
                                            })
                                        }
                                        {/* {selectedProductOutwardDetails.map((productOutward) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={outwardOrder.id}>
                                                    {columns.map((column) => {
                                                        const value = outwardOrder[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}
                                                                className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                                {column.format ? column.format(value, outwardOrder) : (value || '')}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })} */}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DialogContent>
                    </Dialog>
                </form>
            </div >
            :
            null

    )
}

export default OutboundDetails
