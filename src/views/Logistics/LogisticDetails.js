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
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { dateFormat, getURL } from "../../utils/common";
import owareLogo from "../../assets/logo/oware-logo-black.png";
import PrintOutlinedIcon from "@material-ui/icons/PrintOutlined";

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
    tableLayout: "fixed",
    width: "150px"
  },
  topTableItem: {
    fontWeight: "600",
    width: "150px",
    tableLayout: "fixed"
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

  const columnsTop = [
    {
      id: "rideId",
      label: "RIDEID",
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
      format: (value, entity) => `RS. ${entity.price ? entity.price : "-"}`,
    },
    {
      id: "Vehicle.Driver.name",
      label: "DRIVER",
      maxWidth: "150px",
      className: classes.topTableItem,
      format: (value, entity) => (entity.Vehicle.Driver ? entity.Vehicle.Driver.name : "-"),
    },
    // {
    //   id: "Vehicle.Vendor.name",
    //   label: "VENDOR",
    //   minWidth: "auto",
    //   className: classes.topTableItem,
    //   format: (value, entity) => (entity.Vehicle.Vendor ? entity.Vehicle.Vendor.name : "-"),
    // },
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
    }
  ];

  const columnsBottom = [
    // {
    //   id: "PickupCity.name",
    //   label: "PICKUP CITY",
    //   maxWidth: "150px",
    //   className: classes.topTableItem,
    //   format: (value, entity) => (entity.pickupCity ? entity.pickupCity.name : "-"),
    // },
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
    {
      id: "dropoffCity.name",
      label: "DROP OFF CITY",
      maxWidth: "150px",
      className: classes.topTableItem,
      format: (value, entity) => (entity.dropoffCity ? entity.dropoffCity.name : "-"),
    },
    {
      id: "dropoffAddress",
      label: "DROP OFF ADDRESS",
      maxWidth: "150px",
      className: classes.topTableItem,
      format: (value, entity) => entity.dropoffAddress,
    },
    {
      id: "dropoffDate",
      label: "DROP OFF DATE",
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
  const [selectedProductDetails, setSelectedProductDetails] = useState([]);

  useEffect(() => {
    if (selectedProduct)
      axios
        .get(getURL(`/ride/${selectedProduct.id}`))
        .then((response) => {
          setSelectedProductDetails(response.data.data.RideProducts);
          setLogisticDetails(response.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [selectedProduct]);

  return selectedProduct ? (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} maxWidth="lg" aria-labelledby="form-dialog-title">
          <DialogContent className={classes.dialogContent} style={{ padding: 0, minHeight: "80vh" }}>
            <img style={{ width: "14%", margin: "20px" }} src={owareLogo} />
            <Typography style={{ marginLeft: "10px", marginBottom: "10px" }} variant="h3">
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

            <TableContainer className={classes.tableContainerTop}>
              <Table aria-label="sticky table">
                <TableHead>
                  {columnsBottom.map((column, index) => (
                    <TableCell key={index} align={column.align} className={classes.tableHeaderItem}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableHead>
                <TableBody>
                  <TableRow role="checkbox" tabIndex={-1} key={selectedProduct.id}>
                    {columnsBottom.map((column) => {
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

            <TableContainer className={classes.tableContainer}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      align={column.align}
                      className={classes.tableHeaderItem}
                      style={{ backgroundColor: "white" }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableHead>
                <TableBody>
                  {selectedProductDetails.map((logisticDetail, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        {columns.map((column, index) => {
                          const value = logisticDetail[column.id];
                          return (
                            <TableCell
                              key={index}
                              align={column.align}
                              className={
                                column.className && typeof column.className === "function"
                                  ? column.className(value)
                                  : column.className
                              }
                            >
                              {column.format ? column.format(value, logisticDetail) : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
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
