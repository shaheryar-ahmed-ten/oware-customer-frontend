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
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { dateFormat, getURL, dividerDateFormatForFilter } from "../../utils/common";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import TableHeader from "../../components/TableHeader";
import { Pagination } from "@material-ui/lab";
import { debounce } from "lodash";
import { DEBOUNCE_TIME } from "../../config";
import LogisticDetails from "./LogisticDetails";
import clsx from "clsx";
import moment from "moment-timezone";
import FileDownload from "js-file-download";
import SelectCustomDropdown from "../../components/SelectCustomDropdown";

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
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 15px",
  },
  tableContainer: {
    backgroundColor: "white",
  },
  productNameStyle: {
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
  partialStatusButtonStyling: {
    backgroundColor: "#F0F0F0",
    color: "#7D7D7D",
  },
  fullfilledStatusButtonStyling: {
    backgroundColor: "#EAF7D5",
    color: "#69A022",
  },
  completedStatusButtonStyling: {
    backgroundColor: "#32CD32",
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
    margin: "20px",
  },
  externalHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

function Logistics() {
  const classes = useStyles();
  const columns = [
    {
      id: "id",
      label: "RIDE ID",
      minWidth: "auto",
      className: classes.productNameStyle,
      format: (value, entity) => entity.id,
    },
    {
      id: "price",
      label: "PRICE",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: (value, entity) => `RS. ${entity.price ? entity.price : "-"}`,
    },
    {
      id: "pickupDate",
      label: "PICKUP DATE/TIME",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: dateFormat,
    },
    {
      id: "pickupCity.name",
      label: "PICKUP CITY",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: (value, entity) => (entity.pickupCity ? entity.pickupCity.name : null),
    },
    // {
    //   id: "pickupAddress",
    //   label: "PICKUP ADDRESS",
    //   minWidth: "auto",
    //   className: classes.orderIdStyle,
    //   format: (value, entity) => entity.pickupAddress,
    // },
    {
      id: "dropoffCity.name",
      label: "DROPOFF CITY",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: (value, entity) => (entity.dropoffCity ? entity.dropoffCity.name : null),
    },
    {
      id: "dropoffDate",
      label: "DROPOFF DATE/TIME",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: dateFormat,
    },
    {
      id: "status",
      label: "STATUS",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: (value, entity) =>
        entity.status === "ASSIGNED" ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.fullfilledStatusButtonStyling)}>
            ASSIGNED
          </Button>
        ) : entity.status === "PENDING" ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.pendingStatusButtonStyling)}>
            PENDING
          </Button>
        ) : entity.status === "UNASSIGNED" ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            UNASSIGNED
          </Button>
        ) : entity.status === "INPROGRESS" ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            IN-PROGRESS
          </Button>
        ) : entity.status === "COMPLETED" ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.completedStatusButtonStyling)}>
            COMPLETED
          </Button>
        ) : entity.status === "CANCELLED" ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            CANCELLED
          </Button>
        ) : (
          ""
        ),
    },
  ];
  const [logistics, setLogistics] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [numberOfTotalRecords, setNumberOfTotalRecords] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [logisticDetailsViewOpen, setLogisticDetailsViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductForDropdown, setSelectedProductForDropdown] = useState(null);
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
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [startDate, setStartDate] = useState(dividerDateFormatForFilter(null));
  const [endDate, setEndDate] = useState(dividerDateFormatForFilter(null));
  const [selectedDay, setSelectedDay] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const resetFilters = () => {
    setSelectedProductForDropdown(null);
    // setSelectedProduct(null)
    setSelectedDay(null);
    setStartDate(null);
    setEndDate(null);
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

  useEffect(() => {
    getLogistics(page, searchKeyword, selectedProductForDropdown, selectedDay, startDate, endDate);
  }, [page, searchKeyword, selectedProductForDropdown, selectedDay, startDate, endDate]);

  const _getLogistics = (
    page,
    searchKeyword,
    selectedProductForDropdown,
    selectedDay,

    startDate,
    endDate
  ) => {
    axios
      .get(getURL(`/ride`), {
        params: {
          page,
          search: searchKeyword,
          product: selectedProductForDropdown,
          days: selectedDay,
          start: startDate,
          end: endDate,
        },
      })
      .then((res) => {
        setPage(res.data.pages === 1 ? 1 : page);
        setPageCount(res.data.pages);
        setLogistics(res.data.data);
        setNumberOfTotalRecords(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getLogistics = useCallback(
    debounce((page, searchKeyword, selectedProductForDropdown, selectedDay, startDate, endDate) => {
      _getLogistics(page, searchKeyword, selectedProductForDropdown, selectedDay, startDate, endDate);
    }, DEBOUNCE_TIME),
    []
  );

  const openViewDetails = (logistic) => {
    setSelectedProduct(logistic);
    setLogisticDetailsViewOpen(true);
  };

  const closeLogisticDetailsView = () => {
    setLogisticDetailsViewOpen(false);
    setSelectedProduct(null);
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
      placeholder="Pickup City/Dropoff City"
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

  const productDetailsView = (
    <LogisticDetails
      open={logisticDetailsViewOpen}
      handleClose={closeLogisticDetailsView}
      selectedProduct={selectedProduct}
    />
  );

  const exportToExcel = () => {
    axios
      .get(getURL("ride/export"), {
        responseType: "blob",
        params: {
          page,
          search: searchKeyword,
          client_Tz: moment.tz.guess(),
        },
      })
      .then((response) => {
        FileDownload(response.data, `Rides ${moment().format("DD-MM-yyyy")}.xlsx`);
      });
  };

  const headerButtons = [productDetailsView, daysSelect];

  return (
    <>
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item xs={12} className={classes.externalHeader}>
          <Typography variant="h3">
            <Box className={classes.heading}>Logistics</Box>
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
            <TableHeader searchInput={searchInput} buttons={headerButtons} filterCount={1} />
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
                {logistics.map((logistic, index) => {
                  return (
                    <TableRow key={index} hover role="checkbox" tabIndex={-1} onClick={() => openViewDetails(logistic)}>
                      {columns.map((column) => {
                        const value = logistic[column.id];
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
                            {column.format ? column.format(value, logistic) : value || ""}
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
                Showing {logistics.length} out of {numberOfTotalRecords} records.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {customOption}
    </>
  );
}

export default Logistics;
