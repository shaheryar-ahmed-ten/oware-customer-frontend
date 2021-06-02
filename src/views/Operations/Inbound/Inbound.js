import { Box, Divider, Grid, InputBase, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
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
});

function Inbound() {
    const classes = useStyles()
    const columns = [
        {
            id: 'createdAt',
            label: 'INWARD DATE',
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
    const [productInwards, setProductInwards] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [customerProducts, setCustomerProducts] = useState([])
    const [customerWarehouses, setCustomerWarehouses] = useState([])
    const [days, setDays] = useState([{ distinct: 7 }, { distinct: 14 }, { distinct: 30 }, { distinct: 60 }])
    const [selectedWarehouse, setSelectedWarehouse] = useState('')
    const [selectedProduct, setSelectedProduct] = useState('')
    const [selectedDay, setSelectedDay] = useState('')
    useEffect(() => {
        getInwardProducts(page, searchKeyword)
        getRelations()
    }, [page, searchKeyword, selectedWarehouse, selectedProduct, selectedDay])
    const getInwardProducts = (page, searchKeyword) => {
        axios.get(getURL('/inward'), { params: { page, search: searchKeyword || selectedWarehouse || selectedProduct, days: selectedDay } })
            .then(res => {
                setPageCount(res.data.pages)
                setProductInwards(res.data.data)
            });
    }
    const getRelations = () => {
        axios.get(getURL(`/inward/relations`))
            .then((response) => {
                setCustomerProducts(response.data.relations.products)
                setCustomerWarehouses(response.data.relations.warehouses)
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
            <Grid container >
                <Grid item xs={12}>
                    <Typography variant="h3">
                        <Box fontWeight="fontWeightBold">Inwards</Box>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer style={{ backgroundColor: "white" }}>
                        <TableHeader searchInput={searchInput} buttons={headerButtons} />
                        <Divider />
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
                                {productInwards.map((productInward) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={productInward.id}>
                                            {columns.map((column) => {
                                                const value = productInward[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}
                                                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                        {column.format ? column.format(value, productInward) : (value || '')}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid container item justify="space-between">
                        <Grid item></Grid>
                        <Grid item>
                            <Pagination
                                component="div"
                                shape="rounded"
                                count={pageCount}
                                color="primary"
                                page={page}
                                className={classes.pagination}
                                onChange={(e, page) => setPage(page)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default Inbound
