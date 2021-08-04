import { Box, Divider, Grid, InputAdornment, InputBase, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography , Button} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import SelectDropdown from '../../../components/SelectDropdown';
import TableHeader from '../../../components/TableHeader';
import { dateFormat, getURL } from '../../../utils/common';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import ClassOutlinedIcon from '@material-ui/icons/ClassOutlined';
import { debounce } from 'lodash';
import { DEBOUNCE_TIME } from '../../../config';
import { useNavigate } from 'react-router';

const useStyles = makeStyles((theme) => ({
    heading: {
        fontWeight: "600"
    },
    searchInput: {
        border: '1px solid grey',
        borderRadius: 4,
        opacity: 0.6,
        marginRight: 7,
        height: 30,
        // width: 400,
        width: '100%',
        boxSizing: "border-box",
        padding: "15px 15px"
    },
    tableContainer: {
        backgroundColor: 'white'
    },
    gridContainer: {
        boxSizing: 'border-box',
        [theme.breakpoints.up('lg')]: {
            paddingRight: 30,
            paddingTop: 30,
            paddingBottom: 30
        },
    },
    paginationGrid: {
        backgroundColor: 'white',
        padding: '19px 19px 19px 0',
        fontSize: 14,
        color: '#AEAEAE'
    },
    paginationRoot: {
        "& .MuiPaginationItem-root": {
            color: "#AEAEAE",
            backgroundColor: 'transparent',
            fontSize: 14
        },
        '& .Mui-selected': {
            backgroundColor: 'transparent',
            color: '#01D5FF',
            fontSize: 14
        }
    },
    tableCellStyle: {
        color: '#383838',
        fontSize: 14
    },
    tableHeaderItem: {
        background: 'transparent',
        fontWeight: '600',
        fontSize: '12px',
        color: '#A9AEAF',
        borderBottom: 'none',
        paddingBottom: '0'
    }
}));

function Inbound() {
    const classes = useStyles();
    const navigate = useNavigate();

    const columns = [
        {
            id: 'createdAt',
            label: 'DATE OF INWARD',
            minWidth: 'auto',
            className: classes.tableCellStyle,
            format: dateFormat
        },
        {
            id: 'Warehouse.name',
            label: 'WAREHOUSE',
            minWidth: 'auto',
            className: classes.tableCellStyle,
            format: (value, entity) => entity.Warehouse.name,
        },
        {
            id: 'Product.name',
            label: 'PRODUCT',
            minWidth: 'auto',
            className: classes.tableCellStyle,
            format: (value, entity, product) => product.name,
        },
        {
            id: 'quantity',
            label: 'QUANTITY',
            minWidth: 'auto',
            className: classes.tableCellStyle,
            format: (value, entity, product) => product.InwardGroup.quantity,
        },
        {
            id: 'referenceId',
            label: 'REFERENCE NUMBER',
            minWidth: 'auto',
            className: classes.tableCellStyle,
        },
    ]
    const [searchKeyword, setSearchKeyword] = useState('');
    const [productInwards, setProductInwards] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [customerProducts, setCustomerProducts] = useState([])
    const [customerWarehouses, setCustomerWarehouses] = useState([])
    const [days] = useState([{
        id: 7,
        name: '7 days'
    }, {
        id: 14,
        name: '14 days'
    }, {
        id: 30,
        name: '30 days'
    }, {
        id: 60,
        name: '60 days'
    }])
    const [selectedWarehouse, setSelectedWarehouse] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedDay, setSelectedDay] = useState(null)
    const [numberOfTotalRecords, setNumberOfTotalRecords] = useState(0);

    const _getInwardProducts = (page, searchKeyword, selectedWarehouse, selectedProduct, selectedDay) => {
        axios.get(getURL('/inward'), { params: { page, search: searchKeyword, warehouse: selectedWarehouse, product: selectedProduct, days: selectedDay } })
            .then(res => {
                setPage(res.data.pages === 1 ? 1 : page)
                setPageCount(res.data.pages)
                setProductInwards(res.data.data)
                setNumberOfTotalRecords(res.data.count)
            });
    }
    const getInwardProducts = useCallback(debounce((page, searchKeyword, selectedWarehouse, selectedProduct, selectedDay) => {
        _getInwardProducts(page, searchKeyword, selectedWarehouse, selectedProduct, selectedDay)
    }, DEBOUNCE_TIME), [])
    useEffect(() => {
        getRelations()
    }, [])
    useEffect(() => {
        getInwardProducts(page, searchKeyword, selectedWarehouse, selectedProduct, selectedDay)
    }, [page, searchKeyword, selectedWarehouse, selectedProduct, selectedDay])
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
        className={classes.searchInput}
        id="search"
        label="Search"
        type="text"
        variant="outlined"
        value={searchKeyword}
        key={1}
        placeholder="Warehouse / Product / Reference No."
        onChange={e => {
            resetFilters();
            setSearchKeyword(e.target.value)
        }}
        startAdornment={
            <InputAdornment position="start">
                <SearchOutlinedIcon />
            </InputAdornment>
        }
    />;
    const resetFilters = () => {
        setSelectedWarehouse(null)
        setSelectedProduct(null)
        setSelectedDay(null)
    }
    const warehouseSelect = <SelectDropdown icon={<HomeOutlinedIcon fontSize="small" />} resetFilters={resetFilters} type="Warehouses" name="Select Warehouse" list={[{ name: 'All', }, ...customerWarehouses]} selectedType={selectedWarehouse} setSelectedType={setSelectedWarehouse} />
    const productSelect = <SelectDropdown icon={<ClassOutlinedIcon fontSize="small" />} resetFilters={resetFilters} type="Products" name="Select Product" list={[{ name: 'All', }, ...customerProducts]} selectedType={selectedProduct} setSelectedType={setSelectedProduct} />
    const daysSelect = <SelectDropdown icon={<CalendarTodayOutlinedIcon fontSize="small" />} resetFilters={resetFilters} type="Days" name="Select Days" list={[{ name: 'All', }, ...days]} selectedType={selectedDay} setSelectedType={setSelectedDay} />
    const headerButtons = [warehouseSelect, productSelect, daysSelect]

    return (
        <>
            <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        <Box className={classes.heading}>Inwards</Box>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer className={classes.tableContainer}>
                        <TableHeader searchInput={searchInput} buttons={headerButtons} filterCount={3} />
                        <Divider />
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                {columns.map((column, index) => (
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
                                {productInwards.map((productInward, index) => {
                                    return (
                                        productInward.Products.map((product, idx) => {
                                            return (
                                                <TableRow key={idx} hover role="checkbox" tabIndex={-1}>
                                                    {columns.map((column) => {
                                                        const value = productInward[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}
                                                                className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                                {column.format ? column.format(value, productInward, product) : (value || '')}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            )
                                        })
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid container item justify="space-between" className={classes.paginationGrid}>
                        <Grid item>
                            <Pagination
                                component="div"
                                count={pageCount}
                                page={page}
                                classes={{ root: classes.paginationRoot }}
                                onChange={(e, page) => setPage(page)}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="body">Showing {productInwards.length} out of {numberOfTotalRecords} records.</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default Inbound
