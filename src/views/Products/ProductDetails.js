import { Button, Dialog, DialogActions, DialogContent, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getURL } from '../../utils/common';

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
        LineWeight: '15px',
        backgroundColor: '#F8F8F8',
        borderBottom: "none"
    },
    topTableItem: {
        fontWeight: '600'
    }
});
function ProductDetails({ open, handleClose, selectedProduct }) {
    const classes = useStyles()
    const columnsTop = [
        {
            id: 'Product.name',
            label: 'PRODUCT NAME',
            minWidth: 'auto',
            className: classes.topTableItem,
            format: (value, entity) => entity.Product.name,
        },
        {
            id: 'category',
            label: 'CATEGORY',
            minWidth: 'auto',
            className: classes.topTableItem,
            format: (value, entity) => entity.Product.Category.name,
        },
        {
            id: 'brand',
            label: 'BRAND',
            minWidth: 'auto',
            className: classes.topTableItem,
            format: (value, entity) => entity.Product.Brand.name,
        },
        {
            id: 'availableQuantity',
            label: 'QUANTITY AVAILABLE',
            minWidth: 'auto',
            className: classes.topTableItem,
        },
        {
            id: 'committedQuantity',
            label: 'QUANTITY COMMITED',
            minWidth: 'auto',
            className: classes.topTableItem,
        },
    ]
    const columns = [
        {
            id: 'Warehouse.name',
            label: 'WAREHOUSE',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.Warehouse.name,
        },
        {
            id: 'availableQuantity',
            label: 'QUANTITY AVAILABLE',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'committedQuantity',
            label: 'QUANTITY COMMITED',
            minWidth: 'auto',
            className: '',
        },
    ]
    const [selectedProductDetails, setSelectedProductDetails] = useState([])
    useEffect(() => {
        if (selectedProduct)
            axios.get(getURL(`/product/${selectedProduct.id}`))
                .then((response) => {
                    setSelectedProductDetails(response.data.data)
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
                                            selectedProductDetails.map((productDetail, index) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                        {columns.map((column, index) => {
                                                            const value = productDetail[column.id];
                                                            return (
                                                                <TableCell key={index} align={column.align}
                                                                    className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                                    {column.format ? column.format(value, productDetail) : (value)}
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

export default ProductDetails
