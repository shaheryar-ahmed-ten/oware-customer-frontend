import {
  Box,
  Divider,
  Grid,
  InputAdornment,
  InputBase,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  ListItemText,
  TextField,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import SelectDropdown from "../../../components/SelectDropdown";
import TableHeader from "../../../components/TableHeader";
import { dateFormat, getURL, dividerDateFormatForFilter } from "../../../utils/common";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import ClassOutlinedIcon from "@material-ui/icons/ClassOutlined";
import { debounce } from "lodash";
import { DEBOUNCE_TIME } from "../../../config";
import { useNavigate } from "react-router";
import InboundDetails from "./InboundDetails";
import moment from "moment-timezone";
import FileDownload from "js-file-download";
import SelectCustomDropdown from "../../../components/SelectCustomDropdown";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: "600",
  },
  searchInput: {
    border: "1px solid grey",
    borderRadius: 4,
    opacity: 0.6,
    marginRight: 7,
    height: 30,
    // width: 400,
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 15px",
  },
  tableContainer: {
    backgroundColor: "white",
  },
  gridContainer: {
    boxSizing: "border-box",
    [theme.breakpoints.up("lg")]: {
      paddingRight: 30,
      paddingTop: 30,
      paddingBottom: 30,
    },
  },
  paginationGrid: {
    backgroundColor: "white",
    padding: "19px 19px 19px 0",
    fontSize: 14,
    color: "#AEAEAE",
  },
  paginationRoot: {
    "& .MuiPaginationItem-root": {
      color: "#AEAEAE",
      backgroundColor: "transparent",
      fontSize: 14,
    },
    "& .Mui-selected": {
      backgroundColor: "transparent",
      color: "#01D5FF",
      fontSize: 14,
    },
  },
  tableCellStyle: {
    color: "#383838",
    fontSize: 14,
  },
  tableHeaderItem: {
    background: "transparent",
    fontWeight: "600",
    fontSize: "12px",
    color: "#A9AEAF",
    borderBottom: "none",
    paddingBottom: "0",
  },
  orderIdStyle: {
    color: "#1C7DFE",
    textDecoration: "underline",
    cursor: "pointer",
  },
  externalHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

function Inbound() {
  const classes = useStyles();
  const navigate = useNavigate();

  const columns = [
    {
      id: "id",
      label: "INWARD ID",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: (value, entity) => entity.internalIdForBusiness || entity.id,
    },
    {
      id: "createdAt",
      label: "DATE OF INWARD",
      minWidth: "auto",
      className: classes.tableCellStyle,
      format: dateFormat,
    },
    {
      id: "Warehouse.name",
      label: "WAREHOUSE",
      minWidth: "auto",
      className: classes.tableCellStyle,
      format: (value, entity) => entity.Warehouse.name,
    },
    // {
    //     id: 'Product.name',
    //     label: 'PRODUCT',
    //     minWidth: 'auto',
    //     className: classes.tableCellStyle,
    //     format: (value, entity, product) => product.name,
    // },
    // {
    //     id: 'quantity',
    //     label: 'QUANTITY',
    //     minWidth: 'auto',
    //     className: classes.tableCellStyle,
    //     format: (value, entity, product) => product.InwardGroup.quantity,
    // },
    {
      id: "referenceId",
      label: "REFERENCE NUMBER",
      minWidth: "auto",
      className: classes.tableCellStyle,
    },
  ];
  const [searchKeyword, setSearchKeyword] = useState("");
  const [productInwards, setProductInwards] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [customerProducts, setCustomerProducts] = useState([]);
  const [customerWarehouses, setCustomerWarehouses] = useState([]);
  const [days] = useState([
    {
      id: 7,
      name: "7 days",
    },
    {
      id: 14,
      name: "14 days",
    },
    {
      id: 30,
      name: "30 days",
    },
    {
      id: 60,
      name: "60 days",
    },
  ]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  // const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null);
  const [numberOfTotalRecords, setNumberOfTotalRecords] = useState(0);
  const [startDate, setStartDate] = useState(dividerDateFormatForFilter(null));
  const [endDate, setEndDate] = useState(dividerDateFormatForFilter(null));
  const [selectedInbound, setSelectedInbound] = useState(null);
  const [inboundDetailsViewOpen, setInboundDetailsViewOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const startDateRange = (
    <TextField
      id="date"
      label="From"
      type="date"
      variant="outlined"
      className={classes.textFieldRange}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{ max: endDate ? endDate : dividerDateFormatForFilter(Date.now()) }}
      defaultValue={startDate}
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      margin="dense"
    />
  );
  const endDateRange = (
    <TextField
      id="date"
      label="To"
      type="date"
      variant="outlined"
      className={classes.textFieldRange}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{ min: startDate, max: dividerDateFormatForFilter(Date.now()) }}
      defaultValue={endDate}
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      margin="dense"
    />
  );

  const customOption = (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Date Range"}</DialogTitle>
        <DialogContent>
          <ListItemText>{startDateRange}</ListItemText>
          <ListItemText>{endDateRange}</ListItemText>
          {/* {startDateRange}
          {endDateRange} */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMounted(!mounted);
              handleClose();
            }}
            autoFocus
            className={classes.buttonDate}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  const _getInwardProducts = (page, searchKeyword, selectedWarehouse, selectedDay, startDate, endDate) => {
    axios
      .get(getURL("/inward"), {
        params: {
          page,
          search: searchKeyword,
          warehouse: selectedWarehouse,
          days: selectedDay,
          start: startDate,
          end: endDate,
        },
      })
      .then((res) => {
        setPage(res.data.pages === 1 ? 1 : page);
        setPageCount(res.data.pages);
        setProductInwards(res.data.data);
        setNumberOfTotalRecords(res.data.count);
      });
  };

  const getInwardProducts = useCallback(
    debounce((page, searchKeyword, selectedWarehouse, selectedDay, startDate, endDate) => {
      _getInwardProducts(page, searchKeyword, selectedWarehouse, selectedDay, startDate, endDate);
    }, DEBOUNCE_TIME),
    []
  );

  useEffect(() => {
    getRelations();
  }, []);

  useEffect(() => {
    getInwardProducts(
      page,
      searchKeyword,
      selectedWarehouse,
      selectedDay == "custom" ? "" : selectedDay,
      startDate == "-" ? "" : startDate,
      endDate == "-" ? "" : endDate
    );
  }, [page, searchKeyword, selectedWarehouse, selectedDay, mounted]);

  const getRelations = () => {
    axios
      .get(getURL(`/inward/relations`))
      .then((response) => {
        setCustomerProducts(response.data.relations.products);
        setCustomerWarehouses(response.data.relations.warehouses);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openViewDetails = (inbound) => {
    setSelectedInbound(inbound);
    setInboundDetailsViewOpen(true);
  };

  const closeInboundDetailsView = () => {
    setInboundDetailsViewOpen(false);
    setSelectedInbound(null);
  };

  const exportToExcel = () => {
    axios
      .get(getURL("inward/export"), {
        responseType: "blob",
        params: {
          page,
          search: searchKeyword,
          warehouse: selectedWarehouse,
          days: selectedDay == "custom" ? "" : selectedDay,
          start: startDate == "-" ? "" : startDate,
          end: endDate == "-" ? "" : endDate,
          client_Tz: moment.tz.guess(),
        },
      })
      .then((response) => {
        FileDownload(response.data, `ProductInwards ${moment().format("DD-MM-yyyy")}.xlsx`);
      });
  };

  const searchInput = (
    <InputBase
      className={classes.searchInput}
      id="search"
      label="Search"
      type="text"
      variant="outlined"
      value={searchKeyword}
      key={1}
      placeholder="Inward / Warehouse / Reference No."
      onChange={(e) => {
        resetFilters();
        setSearchKeyword(e.target.value);
      }}
      startAdornment={
        <InputAdornment position="start">
          <SearchOutlinedIcon />
        </InputAdornment>
      }
    />
  );

  const resetFilters = () => {
    // setSelectedWarehouse(null);
    // setSelectedProduct(null)
    setSelectedDay(null);
    setStartDate(null);
    setEndDate(null);
  };
  const warehouseSelect = (
    <SelectDropdown
      icon={<HomeOutlinedIcon fontSize="small" />}
      resetFilters={resetFilters}
      type="Warehouses"
      name="Select Warehouse"
      list={[{ name: "All" }, ...customerWarehouses]}
      selectedType={selectedWarehouse}
      setSelectedType={setSelectedWarehouse}
      setPage={setPage}
    />
  );
  // const productSelect = <SelectDropdown icon={<ClassOutlinedIcon fontSize="small" />} resetFilters={resetFilters} type="Products" name="Select Product" list={[{ name: 'All', }, ...customerProducts]} selectedType={selectedProduct} setSelectedType={setSelectedProduct} setPage={setPage} />
  const daysSelect = (
    <SelectCustomDropdown
      icon={<CalendarTodayOutlinedIcon fontSize="small" />}
      resetFilters={resetFilters}
      type="Days"
      name="Select Days"
      list={[{ name: "All" }, ...days]}
      selectedType={selectedDay}
      open={open}
      setOpen={setOpen}
      setSelectedType={setSelectedDay}
      setPage={setPage}
      startDate={startDate}
      endDate={endDate}
    />
  );

  const InboundDetailsView = (
    <InboundDetails
      open={inboundDetailsViewOpen}
      handleClose={closeInboundDetailsView}
      selectedInbound={selectedInbound}
    />
  );

  const headerButtons = [warehouseSelect, daysSelect, InboundDetailsView];

  return (
    <>
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item xs={12} className={classes.externalHeader}>
          <Typography variant="h3">
            <Box className={classes.heading}>Inwards</Box>
            {/* <Button
                            key={2}
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{ float: "right" }}
                            onClick={() => navigate('/inward/add')}>ADD INWARD</Button> */}
          </Typography>
          <Button
            key={2}
            variant="contained"
            color="primary"
            size="small"
            className={classes.exportBtn}
            onClick={() => exportToExcel()}
          >
            {" "}
            EXPORT TO EXCEL
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TableContainer className={classes.tableContainer}>
            <TableHeader searchInput={searchInput} buttons={headerButtons} filterCount={3} />
            <Divider />
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell key={index} align={column.align} className={classes.tableHeaderItem}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {productInwards.map((productInward, idx) => {
                  return (
                    <TableRow
                      key={idx}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      onClick={() => openViewDetails(productInward)}
                    >
                      {columns.map((column) => {
                        const value = productInward[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            className={
                              column.className && typeof column.className === "function"
                                ? column.className(value)
                                : column.className
                            }
                          >
                            {column.format ? column.format(value, productInward) : value || ""}
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
              <Typography variant="body1">
                Showing {productInwards.length} out of {numberOfTotalRecords} records.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {customOption}
    </>
  );
}

export default Inbound;
