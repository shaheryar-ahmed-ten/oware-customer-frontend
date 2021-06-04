import { Button, Dialog, DialogActions, DialogContent, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { LineWeight } from '@material-ui/icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { dateFormat, getURL } from '../../../utils/common';


const useStyles = makeStyles({
    tableContainerTop: {
        backgroundColor: '#F8F8F8'
    },
    tableContainer: {
        backgroundColor: 'white'
    },
    closeButton: {
        backgroundColor: '#0DBDE0;'
    },
    dialogContent: {
        padding: '0'
    },
    tableHeaderItem: {
        fontSize: 12,
        color: '#A9AEAF',
        fontWeight: '600',
        LineWeight: '15px'
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
            id: 'product',
            label: 'PRODUCT',
            minWidth: 'auto',
            className: classes.topTableItem,
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
            axios.get(getURL(`/order/${selectedOutboundOrder.dispatchOrderId}`))
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
                    <Dialog open={open} onClose={handleClose} maxWidth="lg" aria-labelledby="form-dialog-title">
                        <DialogContent className={classes.dialogContent}>
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
                        </DialogContent>
                        <DialogActions>
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
