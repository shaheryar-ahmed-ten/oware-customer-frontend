import { Button, Dialog, DialogActions, DialogContent, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import React from 'react'
import { dateFormat } from '../../../utils/common';
import owareLogo from '../../../assets/logo/owareLogo.png';
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';

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
    },
    icon: {
        position: "relative",
        marginTop: "10px",
        marginLeft: "5px",
        cursor: "pointer"
    },
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

function InboundDetails({ selectedInbound, open, handleClose }) {
    const classes = useStyles();
    const columnsTop = [
        {
            id: 'internalIdForBusiness',
            label: 'INWARD ID',
            minWidth: 'auto',
            className: classes.topTableItem,
        },
        {
            id: 'Warehouse',
            label: 'WAREHOUSE',
            minWidth: 'auto',
            className: classes.topTableItem,
            format: (value, entity) => entity.Warehouse.name,
        },
        {
            id: 'city',
            label: 'CITY',
            minWidth: 'auto',
            className: classes.topTableItem,
            format: (value, entity) => entity.Warehouse.city,
        },
        {
            id: 'createdAt',
            label: 'DATE OF INWARD',
            minWidth: 'auto',
            className: classes.topTableItem,
            format: dateFormat
        },
        {
            id: 'referenceId',
            label: 'REFERENCE NUMBER',
            minWidth: 'auto',
            className: classes.topTableItem,
        },
    ]

    const columns = [
        {
            id: 'id',
            label: 'PRODUCT ID',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'name',
            label: 'PRODUCT',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'uom',
            label: 'UOM',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.UOM.name,
        },
        {
            id: 'weight',
            label: 'WEIGHT',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.weight + ' Kg'
        },
        {
            id: 'qunaityt',
            label: 'QUNTITY',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.InwardGroup.quantity,
        },
    ]
    console.log(selectedInbound)
    return (
        selectedInbound ?
            <div style={{ display: "inline" }}>
                <form>
                    <Dialog open={open} onClose={handleClose} maxWidth="lg" aria-labelledby="form-dialog-title">
                        <DialogContent className={classes.dialogContent} style={{ padding: 0, minHeight: '80vh' }}>
                            <img style={{ width: "10%", margin: "20px" }} src={owareLogo} />
                            <Typography style={{ marginLeft: "10px", marginBottom: "10px", marginTop: "10px" }} variant="h3">
                                Product Details
                                <PrintOutlinedIcon className={classes.icon} onClick={() => window.print()} />
                            </Typography>

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
                                        <TableRow role="checkbox" tabIndex={-1} key={selectedInbound.id}>
                                            {columnsTop.map((column) => {
                                                const value = selectedInbound[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}
                                                        style={{ paddingTop: '0' }}
                                                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                        {column.format ? column.format(value, selectedInbound) : (value || '')}
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
                                            selectedInbound.Products.map((product, index) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                        {columns.map((column, index) => {
                                                            const value = product[column.id];
                                                            return (
                                                                <TableCell key={index} align={column.align}
                                                                    className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                                    {column.format ? column.format(value, product) : (value)}
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
                    </Dialog>
                </form>
            </div>
            :
            ''
    )
}

export default InboundDetails
