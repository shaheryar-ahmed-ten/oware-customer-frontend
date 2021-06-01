import { Box, Grid, InputBase, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import SelectDropdown from '../../../components/SelectDropdown';
import TableHeader from '../../../components/TableHeader';
import { dateFormat, getURL } from '../../../utils/common';

const useStyles = makeStyles({
    searchInput: {
        border: '1px solid grey',
        borderRadius: 4,
        opacity: 0.6,
        padding: '0px 8px',
        marginRight: 7,
        height: 30,
        width: 300,
        boxSizing: "border-box",
        padding: "10px 10px"
    },
    tableContainer: {
        backgroundColor: 'white'
    }
});
function Outbound() {
    const classes = useStyles()
    const columns = [
        {
            id: 'dispatchOrderId',
            label: 'ORDER ID',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.dispatchOrderId,
        },
        {
            id: 'createdAt',
            label: 'ORDER DATE',
            minWidth: 'auto',
            className: '',
            format: dateFormat
        },
        {
            id: 'Warehouse.name',
            label: 'WAREHOUSE',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.Warehouse.name,
        },
        {
            id: 'Product.name',
            label: 'PRODUCT',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.Product.name,
        },
        {
            id: 'quantity',
            label: 'QUANTITY',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'referenceId',
            label: 'REFERENCE ID',
            minWidth: 'auto',
            className: '',
        },
    ]
    const [searchKeyword, setSearchKeyword] = useState('');
    const [outwardOrders, setOutwardOrders] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [customerProducts, setCustomerProducts] = useState([])
    const [customerWarehouses, setCustomerWarehouses] = useState([])
    const [days, setDays] = useState([{ distinct: 7 }, { distinct: 14 }, { distinct: 30 }, { distinct: 60 }])
    const [selectedWarehouse, setSelectedWarehouse] = useState('')
    const [selectedProduct, setSelectedProduct] = useState('')
    const [selectedDay, setSelectedDay] = useState('')
    useEffect(() => {
        getOutwardOrders(page, searchKeyword)
        getRelations()
    }, [page, searchKeyword, selectedWarehouse, selectedProduct, selectedDay])
    const getOutwardOrders = () => {
        axios.get(getURL('/order'), { params: { page, search: searchKeyword || selectedWarehouse || selectedProduct, days: selectedDay } })
            .then((res) => {
                console.log(res.data.data)
                setPageCount(res.data.pages)
                setOutwardOrders(res.data.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const getRelations = () => {
        axios.get(getURL(`/order/relations`))
            .then((res) => {
                setCustomerProducts(res.data.relations.products)
                setCustomerWarehouses(res.data.relations.warehouses)
            })
            .catch((err) => {
                console.log(err)
            })
    };
    const searchInput = <InputBase
        placeholder="Search"
        className={classes.searchInput}
        id="search"
        label="Search"
        type="text"
        variant="outlined"
        value={searchKeyword}
        key={1}
        placeholder="Warehouse / Product / Reference No."
        onChange={e => setSearchKeyword(e.target.value)}
    />;
    const warehouseSelect = <SelectDropdown type="Warehouses" name="Select Warehouse" list={[...customerWarehouses, { distinct: 'All' }]} selectedType={selectedWarehouse} setSelectedType={setSelectedWarehouse} />
    const productSelect = <SelectDropdown type="Products" name="Select Product" list={[...customerProducts, { distinct: 'All' }]} selectedType={selectedProduct} setSelectedType={setSelectedProduct} />
    const daysSelect = <SelectDropdown type="Days" name="Select Days" list={[...days, { distinct: 'All' }]} selectedType={selectedDay} setSelectedType={setSelectedDay} />
    const headerButtons = [warehouseSelect, productSelect, daysSelect]
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        <Box fontWeight="fontWeightBold">Outwards</Box>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer className={classes.tableContainer}>
                        <TableHeader searchInput={searchInput} buttons={headerButtons} />
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
                                {outwardOrders.map((outwardOrder) => {
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
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    )
}

export default Outbound
