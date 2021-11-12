import {
  Box,
  Button,
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
import OutboundDetails from "./OutboundDetails";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import clsx from "clsx";
import { debounce } from "lodash";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import ClassOutlinedIcon from "@material-ui/icons/ClassOutlined";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import { DEBOUNCE_TIME } from "../../../config";
import { useNavigate } from "react-router";
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
    // width: 350,
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 15px",
  },
  tableContainer: {
    backgroundColor: "white",
  },
  orderIdStyle: {
    color: "#1C7DFE",
    textDecoration: "underline",
    cursor: "pointer",
  },
  statusButtons: {
    fontSize: 12,
    borderRadius: "20px",
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
  pendingStatusButtonStyling: {
    backgroundColor: "#FFEEDB",
    color: "#F69148",
  },
  cancelStatusButtonStyling: {
    backgroundColor: "#FFEEDB",
    color: "red",
  },
  partialStatusButtonStyling: {
    backgroundColor: "#F0F0F0",
    color: "#7D7D7D",
    width: 150,
  },
  fullfilledStatusButtonStyling: {
    backgroundColor: "#EAF7D5",
    color: "#69A022",
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
  externalHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
}));
function Outbound() {
  const classes = useStyles();
  const navigate = useNavigate();

  const columns = [
    {
      id: "internalIdForBusiness",
      label: "ORDER ID",
      minWidth: "auto",
      className: classes.orderIdStyle,
    },
    {
      id: "shipmentDate",
      label: "DATE OF ORDER",
      minWidth: "auto",
      className: classes.tableCellStyle,
      format: dateFormat,
    },
    {
      id: "warehouse",
      label: "WAREHOUSE",
      minWidth: "auto",
      className: classes.tableCellStyle,
      format: (value, entity) => entity.Inventory.Warehouse.name,
    },
    // {
    //     id: 'product',
    //     label: 'PRODUCT',
    //     minWidth: 'auto',
    //     className: classes.tableCellStyle,
    // },
    // {
    //     id: 'quantity',
    //     label: 'QUANTITY ORDERD',
    //     minWidth: 'auto',
    //     className: classes.tableCellStyle,
    // },
    {
      id: "referenceId",
      label: "REFERENCE NUMBER",
      minWidth: "auto",
      className: classes.tableCellStyle,
    },
    // {
    //     id: 'outwardQuantity',
    //     label: 'QUANTITY SHIPPED',
    //     minWidth: 'auto',
    //     className: classes.tableCellStyle,
    //     format: (value, entity) => {
    //         let totalDispatched = 0
    //         entity.ProductOutwards.forEach(po => {
    //             po.OutwardGroups.forEach(outGroup => {
    //                 totalDispatched += outGroup.quantity
    //             });
    //         });
    //         return totalDispatched
    //     }
    // },
    {
      id: "Status",
      label: "STATUS",
      minWidth: "auto",
      className: classes.tableCellStyle,
      format: (value, entity) => {
        let totalDispatched = 0;
        entity.ProductOutwards.forEach((po) => {
          po.OutwardGroups.forEach((outGroup) => {
            totalDispatched += outGroup.quantity;
          });
        });
        return entity.status == 0 ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.pendingStatusButtonStyling)}>
            Pending
          </Button>
        ) : entity.status == 1 ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            Partially fulfilled
          </Button>
        ) : entity.status == 2 ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.fullfilledStatusButtonStyling)}>
            Fulfilled
          </Button>
        ) : entity.status == 3 ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.cancelStatusButtonStyling)}>
            Canceled
          </Button>
        ) : (
          ""
        );
      },
    },
  ];
  const [searchKeyword, setSearchKeyword] = useState("");
  const [outwardOrders, setOutwardOrders] = useState([]);
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
  const [statuses] = useState([
    { id: 0, name: "Pending" },
    { id: 1, name: "Partially fulfilled" },
    { id: 2, name: "Fulfilled" },
    { id: 3, name: "Cancelled" },
  ]);

  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [outboundDetailViewOpen, setOutboundDetailViewOpen] = useState(false);
  const [selectedOutboundOrder, setSelectedOutboundOrder] = useState(null);
  const [numberOfTotalRecords, setNumberOfTotalRecords] = useState(0);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [startDate, setStartDate] = useState(dividerDateFormatForFilter(null));
  const [endDate, setEndDate] = useState(dividerDateFormatForFilter(null));

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

  const _getOutwardOrders = (
    page,
    searchKeyword,
    selectedWarehouse,
    selectedProduct,
    selectedDay,
    selectedStatus,
    startDate,
    endDate
  ) => {
    axios
      .get(getURL("/order"), {
        params: {
          page,
          search: searchKeyword,
          warehouse: selectedWarehouse,
          product: selectedProduct,
          days: selectedDay,
          status: selectedStatus,
          start: startDate,
          end: endDate,
        },
      })
      .then((res) => {
        setPage(res.data.pages === 1 ? 1 : page);
        setPageCount(res.data.pages);
        setOutwardOrders(res.data.data);
        setNumberOfTotalRecords(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getOutwardOrders = useCallback(
    debounce(
      (page, searchKeyword, selectedWarehouse, selectedProduct, selectedDay, selectedStatus, startDate, endDate) => {
        _getOutwardOrders(
          page,
          searchKeyword,
          selectedWarehouse,
          selectedProduct,
          selectedDay,
          selectedStatus,
          startDate,
          endDate
        );
      },
      DEBOUNCE_TIME
    ),
    []
  );

  useEffect(() => {
    getRelations();
  }, []);

  useEffect(() => {
    getOutwardOrders(
      page,
      searchKeyword,
      selectedWarehouse,
      selectedProduct,
      selectedDay,
      selectedStatus,
      startDate,
      endDate
    );
  }, [page, searchKeyword, selectedWarehouse, selectedProduct, selectedDay, selectedStatus, startDate, endDate]);

  const getRelations = () => {
    axios
      .get(getURL(`/order/relations`))
      .then((res) => {
        setCustomerProducts(res.data.relations.products);
        setCustomerWarehouses(res.data.relations.warehouses);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const closeOutboundDetailsView = () => {
    setOutboundDetailViewOpen(false);
    setSelectedOutboundOrder(null);
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
      placeholder="Order ID / Warehouse / Reference No."
      onChange={(e) => {
        setPage(1);
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
    setSelectedWarehouse(null);
    setSelectedProduct(null);
    setSelectedDay(null);
    setSelectedStatus(null);
  };

  const exportToExcel = () => {
    axios
      .get(getURL("order/export"), {
        responseType: "blob",
        params: {
          page,
          search: searchKeyword,
          client_Tz: moment.tz.guess(),
        },
      })
      .then((response) => {
        FileDownload(response.data, `Orders ${moment().format("DD-MM-yyyy")}.xlsx`);
      });
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
  const productSelect = (
    <SelectDropdown
      icon={<ClassOutlinedIcon fontSize="small" />}
      resetFilters={resetFilters}
      type="Products"
      name="Select Product"
      list={[{ name: "All" }, ...customerProducts]}
      selectedType={selectedProduct}
      setSelectedType={setSelectedProduct}
      setPage={setPage}
    />
  );
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
  const statusSelect = (
    <SelectDropdown
      icon={<MoreHorizOutlinedIcon fontSize="small" />}
      resetFilters={resetFilters}
      type="Status"
      name="Select Status"
      list={[{ name: "All" }, ...statuses]}
      selectedType={selectedStatus}
      setSelectedType={setSelectedStatus}
      setPage={setPage}
    />
  );

  const outboundDetailsView = (
    <OutboundDetails
      open={outboundDetailViewOpen}
      handleClose={closeOutboundDetailsView}
      selectedOutboundOrder={selectedOutboundOrder}
    />
  );

  const headerButtons = [warehouseSelect, daysSelect, statusSelect, outboundDetailsView];
  const openViewDetails = (productInward) => {
    setSelectedOutboundOrder(productInward);
    setOutboundDetailViewOpen(true);
  };
  return (
    <>
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item xs={12} className={classes.externalHeader}>
          <Typography variant="h3">
            <Box className={classes.heading}>Orders</Box>
          </Typography>
          <Box>
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
            <Button
              key={2}
              variant="contained"
              color="primary"
              size="small"
              style={{ marginLeft: 5 }}
              onClick={() => navigate("/outward/add")}
            >
              ADD ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TableContainer className={classes.tableContainer}>
            <TableHeader searchInput={searchInput} buttons={headerButtons} filterCount={4} />
            <Divider />
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {outwardOrders.map((outwardOrder, index) => {
                  return (
                    <TableRow
                      key={index}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      onClick={() => openViewDetails(outwardOrder)}
                    >
                      {columns.map((column) => {
                        const value = outwardOrder[column.id];
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
                            {column.format ? column.format(value, outwardOrder) : value || ""}
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
                Showing {outwardOrders.length} out of {numberOfTotalRecords} records.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {customOption}
    </>
  );
}

export default Outbound;
