import { Button, Dialog, DialogActions, DialogContent, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { dateFormat, getURL } from '../../../utils/common';


const useStyles = makeStyles({
    tableContainerTop: {
        backgroundColor: '#F8F8F8'
    },
    tableContainer: {
        backgroundColor: 'white',
        paddingTop: 31
    },
    closeButton: {
        backgroundColor: '#0DBDE0;'
    },
    tableHeaderItem: {
        fontSize: 12,
        color: '#A9AEAF',
        fontWeight: '600',
        LineWeight: '15px',
        backgroundColor: '#F8F8F8',
        borderBottom: "none"
    },
    topTableItem: {
        fontWeight: '600'
    }
});
function OutboundDetails({ open, handleClose, selectedOutboundOrder }) {
    const classes = useStyles()
    const columnsTop = [
        {
            id: 'internalIdForBusiness',
            label: 'ORDER ID',
            minWidth: 'auto',
            className: classes.topTableItem,
        },
        {
            id: 'shipmentDate',
            label: 'ORDER DATE',
            minWidth: 'auto',
            className: classes.topTableItem,
            format: dateFormat
        },
        {
            id: 'warehouse',
            label: 'WAREHOUSE',
            minWidth: 'auto',
            className: classes.topTableItem,
        },
        {
            id: 'product',
            label: 'PRODUCT',
            minWidth: 'auto',
            className: classes.topTableItem,
        },
        {
            id: 'dispatchOrderQuantity',
            label: 'QUANTITY ORDERD',
            minWidth: 'auto',
            className: classes.topTableItem,
        },
        {
            id: 'referenceId',
            label: 'REFERENCE ID',
            minWidth: 'auto',
            className: classes.topTableItem,
        },
        {
            id: 'outwardQuantity',
            label: 'QTY SHIPPED',
            minWidth: 'auto',
            className: classes.topTableItem,
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
            id: 'quantity',
            label: 'QUANTITY SHIPPED',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'Vehicle.number',
            label: 'VEHICLE #',
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
    const [productOutwardsLength, setProductOutwardsLength] = useState(0)
    useEffect(() => {
        if (selectedOutboundOrder)
            axios.get(getURL(`/order/${selectedOutboundOrder.dispatchOrderId}`))
                .then((response) => {
                    setSelectedProductOutwardDetails(response.data.data)
                    setProductOutwardsLength(response.data.data[0].ProductOutwards.length)
                })
                .catch((err) => {
                    console.log(err)
                })

    }, [selectedOutboundOrder])

    return (
        selectedOutboundOrder ?
            <div style={{ display: "inline" }}>
                <form>
                    <Dialog open={open} onClose={handleClose} maxWidth="lg" aria-labelledby="form-dialog-title">
                        <DialogContent style={{ padding: 0, minHeight: '80vh' }}>
                            <TableContainer className={classes.tableContainerTop}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        {columnsTop.map((column, index) => (
                                            <TableCell
                                                key={index}
                                                align={column.align}
                                                className={classes.tableHeaderItem}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableHead>
                                    <TableBody>
                                        <TableRow role="checkbox" tabIndex={-1} key={selectedOutboundOrder.id}>
                                            {columnsTop.map((column) => {
                                                const value = selectedOutboundOrder[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}
                                                        style={{ paddingTop: '0' }}
                                                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                        {column.format ? column.format(value, selectedOutboundOrder) : (value || '')}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {
                                productOutwardsLength !== 0 ?
                                    <TableContainer className={classes.tableContainer}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                {columns.map((column, index) => (
                                                    <TableCell
                                                        key={index}
                                                        align={column.align}
                                                        className={classes.tableHeaderItem}
                                                        style={{ backgroundColor: 'white' }}
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
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    :
                                    <Alert severity="info">
                                        <AlertTitle>No Record</AlertTitle>
                                        <strong>No dispatches yet!</strong>
                                    </Alert>
                            }
                        </DialogContent>
                        <DialogActions style={{ boxSizing: 'border-box', padding: '10px 19px' }}>
                            <Button variant="contained" className={classes.closeButton} onClick={handleClose} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </form>
            </div >
            :
            null

    )
}

export default OutboundDetails
