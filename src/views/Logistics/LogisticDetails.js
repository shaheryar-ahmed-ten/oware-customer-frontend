import { Button, Dialog, DialogActions, DialogContent, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { dateFormat, getURL } from '../../utils/common';

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
    dialogContent: {
        padding: '0'
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
function LogisticDetails({ open, handleClose, selectedProduct }) {
    const classes = useStyles();
    const [logisticDetails, setLogisticDetails] = useState(null);

    const columnsTop = [
        {
            id: "rideId",
            label: 'RIDEID',
            minWidth: 'auto',
            className: classes.topTableItem,
            format: (value, entity) => entity,
        },
        {
            id: "status",
            label: 'STATUS',
            minWidth: 'auto',
            className: classes.topTableItem,
            // format: (value, entity) => entity,
        },
        {
            id: "driverId",
            label: 'DRIVER',
            minWidth: 'auto',
            className: classes.topTableItem,
            // format: (value, entity) => entity.driverId,
        },
        {
            id: "vehicleId",
            label: 'VEHICLE',
            minWidth: 'auto',
            className: classes.topTableItem,
            // format: (value, entity) => entity.vehicleId,
        },
        {
            id: "DropOffArea.name",
            label: 'VENDOR',
            minWidth: 'auto',
            className: classes.topTableItem,
            // format: (value, entity) => entity.DropOffArea.name,
        },
        {
            id: "PickupArea.name",
            label: 'PICKUP AREA',
            minWidth: 'auto',
            className: classes.topTableItem,
            // format: (value, entity) => entity.PickupArea.name,
        },
        {
            id: "PickupArea.createdAt",
            label: 'PICKUP AREA DATE/TIME',
            minWidth: 'auto',
            className: classes.topTableItem,
            format : dateFormat
        },
        {
            id: "DropoffArea.name",
            label: 'DROP OFF AREA',
            minWidth: 'auto',
            className: classes.topTableItem,
            // format: (value, entity) => entity.DropoffArea.name,
        },
        {
            id: "dropoffDate",
            label: 'DROP OFF DATE/TIME',
            minWidth: 'auto',
            className: classes.topTableItem,
            format : dateFormat
        }    
    ]
    const columns = [
        {
            id: 'Category.name',
            label: 'PRODUCT CATEGORY',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.Category.name,
        },
        {
            id: 'name',
            label: 'PRODUCT NAME',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'quantity',
            label: 'QUANTITY',
            minWidth: 'auto',
            className: '',
        },
    ]
    const 
    [selectedProductDetails, setSelectedProductDetails] = useState([]);
    

    useEffect(() => {
        if (selectedProduct)
            axios.get(getURL(`/ride/${selectedProduct}`))
                .then((response) => {
                    setSelectedProductDetails(response.data.data.RideProducts)
                    setLogisticDetails(response.data.data)
                })
                .catch((err) => {
                    console.log(err)
                })
     }, [selectedProduct])

    return (
        selectedProduct ?
            <div style={{ display: "inline" }}>
                <form>
                    <Dialog open={open} onClose={handleClose} maxWidth="lg" aria-labelledby="form-dialog-title">
                        <DialogContent className={classes.dialogContent} style={{ padding: 0, minHeight: '80vh' }}>
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
                                        <TableRow role="checkbox" tabIndex={-1} key={selectedProduct.id}>
                                         {columnsTop.map((column) => {
                                                const value = selectedProduct[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}
                                                        style={{ paddingTop: '0' }}
                                                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                        {column.format ? column.format(value, selectedProduct) : (value || '')}
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
                                            selectedProductDetails.map((logisticDetail, index) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                        {columns.map((column, index) => {
                                                            const value = logisticDetail[column.id];
                                                            return (
                                                                <TableCell key={index} align={column.align}
                                                                    className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                                    {column.format ? column.format(value, logisticDetail) : (value)}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        
                        </DialogContent>
                        <DialogActions style={{ boxSizing: 'border-box', padding: '10px 19px' }}>
                            <Button variant="contained" className={classes.closeButton} onClick={handleClose} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </form>
            </div>
            :
            null
    )
}

export default LogisticDetails