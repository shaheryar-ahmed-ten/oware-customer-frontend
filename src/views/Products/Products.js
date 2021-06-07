import { Box, Divider, Grid, InputAdornment, InputBase, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getURL } from '../../utils/common'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import SelectDropdown from '../../components/SelectDropdown';
import TableHeader from '../../components/TableHeader';
import { Pagination } from '@material-ui/lab';
import ProductDetails from './ProductDetails';


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
        width: 400,
        boxSizing: "border-box",
        padding: "15px 15px"
    },
    tableContainer: {
        backgroundColor: 'white'
    },
    productNameStyle: {
        color: '#1C7DFE',
        textDecoration: 'underline'
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
    },
    fullfilledStatusButtonStyling: {
        backgroundColor: '#EAF7D5',
        color: '#69A022'
    }
}));
function Products() {
    const classes = useStyles()
    const columns = [
        {
            id: 'Product.name',
            label: 'PRODUCT',
            minWidth: 'auto',
            className: classes.productNameStyle,
            format: (value, entity) => entity.Product.name,
        },
        {
            id: 'category',
            label: 'CATEGORY',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.Product.Category.name,
        },
        {
            id: 'brand',
            label: 'BRAND',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.Product.Brand.name,
        },
        {
            id: 'uom',
            label: 'UOM',
            minWidth: 'auto',
            className: '',
            format: (value, entity) => entity.Product.UOM.name,
        },
        {
            id: 'availableQuantity',
            label: 'QTY AVAILABLE',
            minWidth: 'auto',
            className: '',
        },
        {
            id: 'committedQuantity',
            label: 'QTY COMMITED',
            minWidth: 'auto',
            className: '',
        },
    ]
    const [products, setProducts] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [numberOfTotalRecords, setNumberOfTotalRecords] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [productDetailsViewOpen, setProductDetailsViewOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        getProducts()
    }, [page, searchKeyword])
    const getProducts = () => {
        axios.get(getURL(`/product`), {
            params: {
                page,
                search: searchKeyword
            }
        })
            .then((res) => {
                console.log(res.data)
                setPage(res.data.pages === 1 ? 1 : page)
                setPageCount(res.data.pages)
                setProducts(res.data.data)
                setNumberOfTotalRecords(res.data.count)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const openViewDetails = product => {
        setSelectedProduct(product);
        setProductDetailsViewOpen(true)
    }
    const closeOutboundDetailsView = () => {
        setProductDetailsViewOpen(false)
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
        placeholder="Product Name"
        onChange={e => {
            setSearchKeyword(e.target.value)
        }}
        startAdornment={
            <InputAdornment position="start">
                <SearchOutlinedIcon />
            </InputAdornment>
        }
    />
    const productDetailsView = <ProductDetails open={productDetailsViewOpen} handleClose={closeOutboundDetailsView} selectedProduct={selectedProduct} />

    const headerButtons = []

    return (
        <>
            <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        <Box className={classes.heading}>Outwards</Box>
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
                                {products.map((product, index) => {
                                    return (
                                        <TableRow key={index} hover role="checkbox" tabIndex={-1} onClick={() => openViewDetails(product)}>
                                            {columns.map((column) => {
                                                const value = product[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}
                                                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                        {column.format ? column.format(value, product) : (value || '')}
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
                            <Typography variant="body">Showing {products.length} out of {numberOfTotalRecords} records.</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default Products
