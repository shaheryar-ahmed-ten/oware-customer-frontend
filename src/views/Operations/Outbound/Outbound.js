import { Box, Button, Divider, Grid, InputBase, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import SelectDropdown from '../../../components/SelectDropdown';
import TableHeader from '../../../components/TableHeader';
import { dateFormat, getURL } from '../../../utils/common';
import OutboundDetails from './OutboundDetails';

const useStyles = makeStyles((theme) => ({
    searchInput: {
        border: '1px solid grey',
        borderRadius: 4,
        opacity: 0.6,
        marginRight: 7,
        height: 30,
        width: 300,
        boxSizing: "border-box",
        padding: "10px 10px"
    },
    tableContainer: {
        backgroundColor: 'white'
    },
    statusButtons: {
        width: 100
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
    }
}));
function Outbound() {
    const classes = useStyles()
    const columns = [
        {
            id: 'internalIdForBusiness',
            label: 'ORDER ID',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'shipmentDate',
            label: 'ORDER DATE',
            minWidth: 'auto',
            className: '',
            format: dateFormat
        },
        {
            id: 'warehouse',
            label: 'WAREHOUSE',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'product',
            label: 'PRODUCT',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'dispatchOrderQuantity',
            label: 'QUANTITY ORDERD',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'referenceId',
            label: 'REFERENCE ID',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'outwardQuantity',
            label: 'QUANTITY SHIPPED',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'Status',
            label: 'STATUS',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => +entity.outwardQuantity === 0 ? <Button color="primary" className={classes.statusButtons}>
                Pending
      </Button> : +entity.outwardQuantity > 0 && +entity.outwardQuantity < entity.dispatchOrderQuantity ? <Button color="primary" className={classes.statusButtons}>
                    Partially fulfilled
          </Button> : entity.dispatchOrderQuantity === +entity.outwardQuantity ? <Button color="primary" className={classes.statusButtons}>
                        Fulfilled
          </Button> : ''
        },
    ]
    const [searchKeyword, setSearchKeyword] = useState('');
    const [outwardOrders, setOutwardOrders] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [customerProducts, setCustomerProducts] = useState([])
    const [customerWarehouses, setCustomerWarehouses] = useState([])
    const [days] = useState([{
        distinct: 7,
        label: '7 days'
    }, {
        distinct: 14,
        label: '14 days'
    }, {
        distinct: 30,
        label: '30 days'
    }, {
        distinct: 60,
        label: '60 days'
    }])
    const [statuses] = useState([{ distinct: 0, label: 'Pending' }, { distinct: 1, label: 'Partially fulfilled' }, { distinct: 2, label: 'Fulfilled' }])
    const [selectedWarehouse, setSelectedWarehouse] = useState('')
    const [selectedProduct, setSelectedProduct] = useState('')
    const [selectedDay, setSelectedDay] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')
    const [outboundDetailViewOpen, setOutboundDetailViewOpen] = useState(false);
    const [selectedOutboundOrder, setSelectedOutboundOrder] = useState(null);
    const [numberOfTotalRecords, setNumberOfTotalRecords] = useState(0);

    const getOutwardOrders = () => {
        axios.get(getURL('/order'), {
            params: {
                page,
                search: searchKeyword || selectedWarehouse || selectedProduct,
                days: selectedDay,
                status: selectedStatus
            }
        })
            .then((res) => {
                setPageCount(res.data.pages)
                setOutwardOrders(res.data.data)
                setNumberOfTotalRecords(res.data.count)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getRelations();
    }, []);
    useEffect(() => {
        getOutwardOrders(page, searchKeyword);
    }, [page, searchKeyword, selectedWarehouse, selectedProduct, selectedDay, selectedStatus]);
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
    const closeInwardOutboundDetailsView = () => {
        setOutboundDetailViewOpen(false)
        setSelectedOutboundOrder(null)
    }

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
    />;
    const resetFilters = () => {
        setSelectedWarehouse('');
        setSelectedProduct('');
        setSelectedDay('');
        setSelectedStatus('');
    }
    const warehouseSelect = <SelectDropdown resetFilters={resetFilters} type="Warehouses" name="Select Warehouse" list={[{ distinct: 'All' }, ...customerWarehouses]} selectedType={selectedWarehouse} setSelectedType={setSelectedWarehouse} />
    const productSelect = <SelectDropdown resetFilters={resetFilters} type="Products" name="Select Product" list={[{ distinct: 'All' }, ...customerProducts]} selectedType={selectedProduct} setSelectedType={setSelectedProduct} />
    const daysSelect = <SelectDropdown resetFilters={resetFilters} type="Days" name="Select Days" list={[{ distinct: 'All' }, ...days]} selectedType={selectedDay} setSelectedType={setSelectedDay} />
    const statusSelect = <SelectDropdown resetFilters={resetFilters} type="Status" name="Select Status" list={[{ distinct: 'All' }, ...statuses]} selectedType={selectedStatus} setSelectedType={setSelectedStatus} />

    const outboundDetailsView = <OutboundDetails open={outboundDetailViewOpen} handleClose={closeInwardOutboundDetailsView} selectedOutboundOrder={selectedOutboundOrder} />

    const headerButtons = [warehouseSelect, productSelect, daysSelect, statusSelect, outboundDetailsView]
    const openViewDetails = productInward => {
        setSelectedOutboundOrder(productInward);
        setOutboundDetailViewOpen(true)
    }
    return (
        <>
            <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        <Box fontWeight="fontWeightBold">Outwards</Box>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer className={classes.tableContainer}>
                        <TableHeader searchInput={searchInput} buttons={headerButtons} />
                        <Divider />
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                {columns.map((column, index) => (
                                    <TableCell
                                        key={index}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, background: 'transparent', fontWeight: '600', fontSize: '12px', color: '#A9AEAF' }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableHead>
                            <TableBody>
                                {outwardOrders.map((outwardOrder, index) => {
                                    return (
                                        <TableRow key={index} hover role="checkbox" tabIndex={-1} onClick={() => openViewDetails(outwardOrder)}>
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
                            <Typography variant="body">Showing {outwardOrders.length} out of {numberOfTotalRecords} records.</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default Outbound
