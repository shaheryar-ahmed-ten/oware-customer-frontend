import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Grid,
  AppBar,
  Tab,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { dateFormat, getURL } from "../../utils/common";
import owareLogo from "../../assets/logo/oware-logo-black.png";
import PrintOutlinedIcon from "@material-ui/icons/PrintOutlined";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";

const useStyles = makeStyles({
  heading: {
    fontWeight: "600",
    margin: "10px",
    textAlign: "left",
  },
  tableContainerTop: {
    backgroundColor: "#F8F8F8",
  },
  tableContainer: {
    backgroundColor: "white",
    paddingTop: 31,
  },
  closeButton: {
    backgroundColor: "#0DBDE0;",
  },
  dialogContent: {
    padding: "0",
  },
  tableHeaderItem: {
    fontSize: 12,
    color: "#A9AEAF",
    fontWeight: "600",
    LineWeight: "15px",
    backgroundColor: "#F8F8F8",
    borderBottom: "none",
    padding: "10px",
    // tableLayout: "fixed",
    // width: "150px"
  },
  topTableItem: {
    fontWeight: "600",
    // width: "150px",
    // tableLayout: "fixed"
  },
  icon: {
    position: "relative",
    marginTop: "10px",
    marginLeft: "5px",
    cursor: "pointer",
  },
});
function LogisticDetails({ open, handleClose, selectedProduct }) {
  const classes = useStyles();
  const [logisticDetails, setLogisticDetails] = useState(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState([]);
  const [value, setValue] = useState(1); // for dropoff tabs
  const [rideDropoffs, setRideDropoffs] = useState([]);
  const columnsTop = [
    {
      id: "rideId",
      label: "LOAD ID",
      maxWidth: "150px",
      className: classes.topTableItem,
      format: (value, entity) => entity.id,
    },
    {
      id: "status",
      label: "STATUS",
      maxWidth: "150px",
      className: classes.topTableItem,
      format: (value, entity) => entity.status,
    },
    {
      id: "price",
      label: "PRICE",
      maxWidth: "150px",
      className: classes.topTableItem,
      format: (value, entity) => (entity.price ? `RS.${entity.price}` : "-"),
    },
    {
      id: "Vehicle.Driver.name",
      label: "DRIVER",
      maxWidth: "150px",
      className: classes.topTableItem,
      format: (value, entity) => (entity.Driver ? entity.Driver.name : "-"),
    },

    {
      id: "Vehicle.registrationNumber",
      label: "VEHICLE",
      maxWidth: "150px",
      className: classes.topTableItem,
      format: (value, entity) => (entity.Vehicle ? entity.Vehicle.registrationNumber : "-"),
    },
    {
      id: "PickupCity.name",
      label: "PICKUP CITY",
      maxWidth: "150px",
      className: classes.topTableItem,
      format: (value, entity) => (entity.pickupCity ? entity.pickupCity.name : "-"),
    },
    {
      id: "pickupAddress",
      label: "PICKUP ADDRESS",
      maxWidth: "150px",
      className: classes.topTableItem,
      format: (value, entity) => entity.pickupAddress,
    },
    {
      id: "pickupDate",
      label: "PICKUP DATE",
      maxWidth: "150px",
      className: classes.topTableItem,
      format: dateFormat,
    },
    // Dummy data
    {
      id: "PickupCityy.name",
      label: " ",
      maxWidth: "150px",
      className: classes.topTableItem,
      format: (value, entity) => (entity.pickupCityy ? entity.pickupCityy.name : " "),
    },
  ];

  const columns = [
    {
      id: "Category.name",
      label: "PRODUCT CATEGORY",
      minWidth: "auto",
      className: "",
      format: (value, entity) => entity.Category.name,
    },
    {
      id: "name",
      label: "PRODUCT NAME",
      minWidth: "auto",
      className: "",
    },
    {
      id: "quantity",
      label: "QUANTITY",
      minWidth: "auto",
      className: "",
    },
  ];

  useEffect(() => {
    if (selectedProduct) {
      axios
        .get(getURL(`/ride/${selectedProduct.id}`))
        .then((response) => {
          // setSelectedProductDetails(response.data.data.RideProducts);
          setSelectedProductDetails([]);
          setLogisticDetails(response.data.data);
          setRideDropoffs(response.data.data.RideDropoff);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedProduct]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return selectedProduct ? (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth aria-labelledby="form-dialog-title">
          <DialogContent className={classes.dialogContent} style={{ padding: 0, minHeight: "80vh" }}>
            {/* For Print View */}
            <Box display="none" displayPrint="block">
              <Box style={{ padding: "0mm 0mm" }}>
                <img style={{ width: "20%", margin: "20px 0px" }} src={owareLogo} />
                <Typography style={{ marginBottom: "10px", marginTop: "10px" }} variant="h3">
                  Delivery Details
                </Typography>

                <Grid container item xs={12} style={{ marginTop: 20 }} justifyContent="space-between">
                  <Grid container>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      LOAD ID :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic" }}>
                      {selectedProduct.id || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Status :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic" }}>
                      {selectedProduct.status || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Price :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic" }}>
                      {selectedProduct.price || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Driver :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic" }}>
                      {selectedProduct.Driver ? selectedProduct.Driver.name : "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Vehicle :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic" }}>
                      {selectedProduct.Vehicle ? selectedProduct.Vehicle.registrationNumber || "-" : "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Pickup City :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic" }}>
                      {selectedProduct.pickupCity ? selectedProduct.pickupCity.name || "-" : "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Pickup Address :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic" }}>
                      {selectedProduct.pickupAddress || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Pickup Date:
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic" }}>
                      {dateFormat(selectedProduct.pickupDate) || "-"}
                    </Grid>
                  </Grid>
                  {/* <Grid container>
                    <Typography style={{ marginTop: "20px", marginBottom: "20px" }} variant="h5">
                      Dropoff Details
                    </Typography>
                  </Grid> */}
                </Grid>
                <Grid container item xs={12} style={{ marginTop: 20 }} justifyContent="space-between">
                  <Grid container>
                    <Typography style={{ marginTop: "20px", marginBottom: "20px" }} variant="h5">
                      Dropoff Details
                    </Typography>
                  </Grid>
                  <Grid container style={{ display: "block" }}>
                    {rideDropoffs.map((dropoff, index) => {
                      return (
                        <>
                          <Grid container style={{ display: "inline-block" }}>
                            <Grid container item xs={12} style={{ marginBottom: 25 }}>
                              <Grid style={{ fontWeight: 500 }} item xs={6}>
                                DROPOFF ID :
                              </Grid>
                              <Grid item xs={6} style={{ fontStyle: "italic" }}>
                                {index > -1 ? index + 1 : "-"}
                              </Grid>
                              <Grid style={{ fontWeight: 500 }} item xs={6}>
                                DROPOFF STATUS :
                              </Grid>
                              <Grid item xs={6} style={{ fontStyle: "italic" }}>
                                {dropoff.status ? dropoff.status : "-"}
                              </Grid>
                              <Grid style={{ fontWeight: 500 }} item xs={6}>
                                OUTWARD ID :
                              </Grid>
                              <Grid item xs={6} style={{ fontStyle: "italic" }}>
                                {dropoff.ProductOutward ? dropoff.ProductOutward.internalIdForBusiness : "-"}
                              </Grid>
                              <Grid style={{ fontWeight: 500 }} item xs={6}>
                                DROPOFF CITY :
                              </Grid>
                              <Grid item xs={6} style={{ fontStyle: "italic" }}>
                                {dropoff.DropoffCity ? dropoff.DropoffCity.name : "-"}
                              </Grid>
                              <Grid style={{ fontWeight: 500 }} item xs={6}>
                                DROPOFF ADDRESS :
                              </Grid>
                              <Grid item xs={6} style={{ fontStyle: "italic" }}>
                                {dropoff.address ? dropoff.address : "-"}
                              </Grid>
                              <Grid style={{ fontWeight: 500 }} item xs={6}>
                                DROPOFF DATE :
                              </Grid>
                              <Grid item xs={6} style={{ fontStyle: "italic" }}>
                                {dropoff.dateTime ? dateFormat(dropoff.dateTime) : "-"}
                              </Grid>
                              <Grid style={{ fontWeight: 500 }} item xs={6}>
                                POC NAME :
                              </Grid>
                              <Grid item xs={6} style={{ fontStyle: "italic" }}>
                                {dropoff.pocName ? dropoff.pocName : "-"}
                              </Grid>
                              <Grid style={{ fontWeight: 500 }} item xs={6}>
                                POC NUMBER :
                              </Grid>
                              <Grid item xs={6} style={{ fontStyle: "italic" }}>
                                {dropoff.pocNumber ? dropoff.pocNumber : "-"}
                              </Grid>
                              <Grid style={{ fontWeight: 500 }} item xs={6}>
                                CURRENT LOCATION
                              </Grid>
                              <Grid item xs={6} style={{ fontStyle: "italic" }}>
                                {dropoff.currentLocation ? dropoff.currentLocation : "-"}
                              </Grid>
                            </Grid>
                          </Grid>

                          {/* </Grid> */}
                        </>
                      );
                    })}
                  </Grid>
                </Grid>
              </Box>
            </Box>

            <Box display="block" displayPrint="none">
              <img style={{ width: "17%", margin: "20px" }} src={owareLogo} />
              <Typography style={{ marginLeft: "10px", marginBottom: "10px", marginTop: "10px" }} variant="h3">
                Delivery Details
                <Box display="inline" displayPrint="none">
                  <PrintOutlinedIcon className={classes.icon} onClick={() => window.print()} />
                </Box>
              </Typography>
              <TableContainer className={classes.tableContainerTop}>
                <Table aria-label="sticky table">
                  <TableHead>
                    {columnsTop.map((column, index) => (
                      <TableCell key={index} align={column.align} className={classes.tableHeaderItem}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableHead>
                  <TableBody>
                    <TableRow role="checkbox" tabIndex={-1} key={selectedProduct.id}>
                      {columnsTop.map((column) => {
                        const value = selectedProduct[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ paddingTop: "0" }}
                            className={
                              column.className && typeof column.className === "function"
                                ? column.className(value)
                                : column.className
                            }
                          >
                            {column.format ? column.format(value, selectedProduct) : value || ""}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography style={{ marginLeft: "10px", marginBottom: "20px", marginTop: "40px" }} variant="h5">
                Dropoff Details
              </Typography>
              <TabContext value={value}>
                <>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {rideDropoffs.map((dropoff, index) => {
                      return <Tab label={"Dropoff" + `${index + 1}`} value={index + 1} />;
                    })}
                  </TabList>

                  {rideDropoffs.map((dropoff, index) => {
                    return (
                      <TabPanel value={index + 1}>
                        <TableContainer className={classes.parentContainer} style={{ overflow: "hidden" }}>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                <TableCell className={classes.tableHeadText}>OUTWARD ID</TableCell>
                                <TableCell className={classes.tableHeadText}>DROPOFF STATUS</TableCell>
                                <TableCell className={classes.tableHeadText}>DROPOFF CITY</TableCell>
                                <TableCell className={classes.tableHeadText}>DROPOFF ADDRESS</TableCell>
                                <TableCell className={classes.tableHeadText}>DROPOFF DATE</TableCell>
                                <TableCell className={classes.tableHeadText}>POC NAME</TableCell>
                                <TableCell className={classes.tableHeadText}>POC NUMBER</TableCell>
                                <TableCell className={classes.tableHeadText}>CURRENT LOCATION</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <>
                                <TableRow>
                                  <TableCell>
                                    {dropoff.ProductOutward ? dropoff.ProductOutward.internalIdForBusiness : "-"}
                                  </TableCell>
                                  <TableCell>{dropoff.status ? dropoff.status : "-"}</TableCell>
                                  <TableCell>{dropoff.DropoffCity ? dropoff.DropoffCity.name : "-"}</TableCell>
                                  <TableCell>{dropoff.address ? dropoff.address : "-"}</TableCell>
                                  <TableCell>{dropoff.dateTime ? dateFormat(dropoff.dateTime) : "-"}</TableCell>
                                  <TableCell>{dropoff.pocName ? dropoff.pocName : "-"}</TableCell>
                                  <TableCell>{dropoff.pocNumber ? dropoff.pocNumber : "-"}</TableCell>
                                  <TableCell>{dropoff.currentLocation ? dropoff.currentLocation : "-"}</TableCell>
                                </TableRow>
                              </>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </TabPanel>
                    );
                  })}
                </>
              </TabContext>
            </Box>
          </DialogContent>
          <Box display="inline" displayPrint="none">
            <DialogActions style={{ boxSizing: "border-box", padding: "10px 19px" }}>
              <Button variant="contained" className={classes.closeButton} onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </form>
    </div>
  ) : null;
}

export default LogisticDetails;
