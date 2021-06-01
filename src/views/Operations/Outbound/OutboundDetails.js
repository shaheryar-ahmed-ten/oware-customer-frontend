import { Dialog, DialogContent, DialogTitle, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React from 'react'
import TableHeader from '../../../components/TableHeader';
import { dateFormat } from '../../../utils/common';


const useStyles = makeStyles({
    tableContainer: {
        backgroundColor: 'white'
    }
});
function OutboundDetails({ open, handleClose, selectedOutboundOrder }) {
    const classes = useStyles()
    console.log(selectedOutboundOrder)
    const columnsTop = [
        {
            id: 'Product.name',
            label: 'PRODUCT',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.Product.name,
        },
        {
            id: 'Warehouse.name',
            label: 'WAREHOUSE',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.Warehouse.name,
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
            label: 'QUANTITY COMMITTED',
            minWidth: 'auto',
            className: '',
        }
    ]
    return (
        selectedOutboundOrder ?
            <div style={{ display: "inline" }}>
                <form>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogContent>
                            <TableContainer className={classes.tableContainer}>
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
