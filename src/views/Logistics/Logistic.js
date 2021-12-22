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
import { RIDE_STATUS } from "../../utils/enums/ride";

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
      label: "LOAD ID",
      minWidth: "auto",
      className: classes.productNameStyle,
      format: (value, entity) => entity.id,
    },
    {
      id: "price",
      label: "PRICE",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: (value, entity) => (entity.price ? `RS.${entity.price}` : "-"),
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
    {
      id: "vehicle",
      label: "VEHCILE",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: (value, entity) => (entity.Vehicle ? entity.Vehicle.registrationNumber : null),
    },
    {
      id: "status",
      label: "STATUS",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: (value, entity) =>
        entity.status === RIDE_STATUS.SCHEDULED ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.fullfilledStatusButtonStyling)}>
            {RIDE_STATUS.SCHEDULED}
          </Button>
        ) : entity.status === RIDE_STATUS.NOT_ASSIGNED ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            {RIDE_STATUS.NOT_ASSIGNED}
          </Button>
        ) : entity.status === RIDE_STATUS.ON_THE_WAY ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            {RIDE_STATUS.ON_THE_WAY}
          </Button>
        ) : entity.status === RIDE_STATUS.ARRIVED ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            {RIDE_STATUS.ARRIVED}
          </Button>
        ) : entity.status === RIDE_STATUS.LOADING_IN_PROGRESS ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            {RIDE_STATUS.LOADING_IN_PROGRESS}
          </Button>
        ) : entity.status === RIDE_STATUS.LOADING_COMPLETE ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            {RIDE_STATUS.LOADING_COMPLETE}
          </Button>
        ) : entity.status === RIDE_STATUS.LOAD_IN_TRANSIT ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            {RIDE_STATUS.LOAD_IN_TRANSIT}
          </Button>
        ) : entity.status === RIDE_STATUS.REACHED ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            {RIDE_STATUS.REACHED}
          </Button>
        ) : entity.status === RIDE_STATUS.OFFLOADING_IN_PROGRESS ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            {RIDE_STATUS.OFFLOADING_IN_PROGRESS}
          </Button>
        ) : entity.status === RIDE_STATUS.LOAD_DELIVERED ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.fullfilledStatusButtonStyling)}>
            {RIDE_STATUS.LOAD_DELIVERED}
          </Button>
        ) : entity.status === RIDE_STATUS.CANCELLED ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            {RIDE_STATUS.CANCELLED}
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

  const dummySelect = <Box />;

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

  const _getLogistics = (page, searchKeyword, selectedProductForDropdown, selectedDay, startDate, endDate) => {
    axios
      .get(getURL(`/ride`), {
        params: {
          page,
          search: searchKeyword,
          product: selectedProductForDropdown,
          days: selectedDay == "custom" ? "" : selectedDay,
          start: startDate == "-" ? "" : startDate,
          end: endDate == "-" ? "" : endDate,
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
          product: selectedProductForDropdown,
          days: selectedDay == "custom" ? "" : selectedDay,
          start: startDate == "-" ? "" : startDate,
          end: endDate == "-" ? "" : endDate,
          client_Tz: moment.tz.guess(),
        },
      })
      .then((response) => {
        FileDownload(response.data, `Loads ${moment().format("DD-MM-yyyy")}.xlsx`);
      });
  };

  const headerButtons = [daysSelect, productDetailsView, dummySelect];

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
