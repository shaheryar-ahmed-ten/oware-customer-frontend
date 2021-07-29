import { Box, Divider, Grid, InputAdornment, InputBase, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { dateFormat, getURL } from '../../utils/common'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import SelectDropdown from '../../components/SelectDropdown';
import TableHeader from '../../components/TableHeader';
import { Pagination } from '@material-ui/lab';
import ClassOutlinedIcon from '@material-ui/icons/ClassOutlined';
import { debounce } from 'lodash';
import { DEBOUNCE_TIME } from '../../config';
import LogisticDetails from './LogisticDetails';

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
    productNameStyle: {
        color: '#1C7DFE',
        textDecoration: 'underline',
        cursor : 'pointer'
    },
    statusButtons: {
        fontSize: 12,
        borderRadius: '20px'
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
    pendingStatusButtonStyling: {
        backgroundColor: '#FFEEDB',
        color: '#F69148'
    },
    partialStatusButtonStyling: {
        backgroundColor: '#F0F0F0',
        color: '#7D7D7D',
        width: 150,
        borderRadius : "10px",
        margin : "20px"
    },
    fullfilledStatusButtonStyling: {
        backgroundColor: '#EAF7D5',
        color: '#69A022'
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
function Logistics() {
    const classes = useStyles()
    const columns = [
        {
            id: 'id',
            label: 'RIDE ID',
            minWidth: 'auto',
            className: classes.productNameStyle,
            format: (value, entity) => entity.id,
        },
        {
            id: 'price',
            label: 'PRICE',
            minWidth: 'auto',
            className: classes.orderIdStyle,
            format: (value, entity) => `RS. ${entity.price ? entity.price : "-"}`,
        },
        {
            id: 'pickupDate',
            label: 'PICKUP DATE/TIME',
            minWidth: 'auto',
            className: classes.orderIdStyle,
            format: dateFormat,
        },
        {
            id: 'pickupAddress',
            label: 'PICKUP AREA',
            minWidth: 'auto',
            className: classes.orderIdStyle,
            format: (value, entity) => entity.pickupAddress,
        },
        {
            id: 'pickupAddress',
            label: 'PICKUP ADDRESS',
            minWidth: 'auto',
            className: classes.orderIdStyle,
            format: (value, entity) => entity.pickupAddress,
        },
        {
            id: 'dropoffAreaId',
            label: 'DROPOFF AREA',
            minWidth: 'auto',
            className: classes.orderIdStyle,
            format: (value, entity) => entity.dropoffAddress,
        },
        {
            id: 'dropoffDate',
            label: 'DROPOFF DATE/TIME',
            minWidth: 'auto',
            className: classes.orderIdStyle,
            format: dateFormat,
        },
        {
            id: 'status',
            label: 'STATUS',
            minWidth: 'auto',
            className: classes.orderIdStyle,
            format: (value, entity) => entity.status,
        },
    ]
    const [logistics, setLogistics] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [numberOfTotalRecords, setNumberOfTotalRecords] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [logisticDetailsViewOpen, setLogisticDetailsViewOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProductForDropdown, setSelectedProductForDropdown] = useState(null);
    const [customerProducts, setCustomerProducts] = useState([])

    useEffect(() => {
        getLogistics(page, searchKeyword, selectedProductForDropdown)
    }, [page, searchKeyword, selectedProductForDropdown])
    useEffect(() => {
        getRealtions()
    }, [])
    const _getLogistics = (page, searchKeyword, selectedProductForDropdown) => {
        axios.get(getURL(`/ride`), {
            params: {
                page,
                search: searchKeyword,
                product: selectedProductForDropdown,
            }
        })
            .then((res) => {
                setPage(res.data.pages === 1 ? 1 : page)
                setPageCount(res.data.pages)
                setLogistics(res.data.data)
                setNumberOfTotalRecords(res.data.count)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const getLogistics = useCallback(debounce((page, searchKeyword, selectedProductForDropdown) => {
        _getLogistics(page, searchKeyword, selectedProductForDropdown)
    }, DEBOUNCE_TIME), [])

    const getRealtions = () => {
        axios.get(getURL('/product/relations'))
            .then((res) => {
                console.log(res)
                setCustomerProducts(res.data.relations.products)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const openViewDetails = logistic => {
        setSelectedProduct(logistic);
        setLogisticDetailsViewOpen(true)
    }
    const closeLogisticDetailsView = () => {
        setLogisticDetailsViewOpen(false)
        setSelectedProduct(null)
    }

    const searchInput = <InputBase
        className={classes.searchInput}
        id="search"
        label="Search"
        type="text"
        variant="outlined"
        value={searchKeyword}
        key={1}
        placeholder="Pickup Area/Dropoff Area"
        onChange={e => {
            resetFilters();
            setSearchKeyword(e.target.value)
        }}
        startAdornment={
            <InputAdornment position="start">
                <SearchOutlinedIcon />
            </InputAdornment>
        }
    />
    const resetFilters = () => {
        setSelectedProductForDropdown(null);
    }
    // const productSelect = <SelectDropdown icon={<ClassOutlinedIcon fontSize="small" />} resetFilters={resetFilters} type="Products" name="Select Product" list={[{ name: 'All' }, ...customerProducts]} selectedType={selectedProductForDropdown} setSelectedType={setSelectedProductForDropdown} />

    const productDetailsView = <LogisticDetails open={logisticDetailsViewOpen} handleClose={closeLogisticDetailsView} selectedProduct={selectedProduct} />

    const headerButtons = [ productDetailsView]

    return (
        <>
            <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        <Box className={classes.heading}>Logistics</Box>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer className={classes.tableContainer}>
                        <TableHeader searchInput={searchInput} buttons={headerButtons} filterCount={1} />
                        <Divider />
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                {columns.map((column, index) => (
                                    <TableCell
                                        key={index}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                        className={classes.tableHeaderItem}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableHead>
                            <TableBody>
                                {logistics.map((logistic, index) => {
                                    return (
                                        <TableRow key={index} hover role="checkbox" tabIndex={-1} onClick={() => openViewDetails(logistic.id)}>
                                            {columns.map((column) => {
                                                const value = logistic[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}
                                                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                        {column.format ? column.format(value, logistic) : (value || '')}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
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
                            <Typography variant="body">Showing {logistics.length} out of {numberOfTotalRecords} records.</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default Logistics
