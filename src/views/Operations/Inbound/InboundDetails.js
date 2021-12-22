import {
  Button,
  Box,
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
  Grid
} from "@material-ui/core";
import React from "react";
import { dateFormat } from "../../../utils/common";
import owareLogo from "../../../assets/logo/oware-logo-black.png";
import PrintOutlinedIcon from "@material-ui/icons/PrintOutlined";

const useStyles = makeStyles({
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
  tableHeaderItem: {
    fontSize: 12,
    color: "#A9AEAF",
    fontWeight: "600",
    LineWeight: "15px",
    backgroundColor: "#F8F8F8",
    borderBottom: "none",
  },
  topTableItem: {
    fontWeight: "600",
  },
  icon: {
    position: "relative",
    marginTop: "10px",
    marginLeft: "5px",
    cursor: "pointer",
  },
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function InboundDetails({ selectedInbound, open, handleClose }) {
  const classes = useStyles();
  const columnsTop = [
    {
      id: "internalIdForBusiness",
      label: "INWARD ID",
      minWidth: "auto",
      className: classes.topTableItem,
    },
    {
      id: "Warehouse",
      label: "WAREHOUSE",
      minWidth: "auto",
      className: classes.topTableItem,
      format: (value, entity) => entity.Warehouse.name,
    },
    {
      id: "city",
      label: "CITY",
      minWidth: "auto",
      className: classes.topTableItem,
      format: (value, entity) => entity.Warehouse.city,
    },
    {
      id: "createdAt",
      label: "DATE OF INWARD",
      minWidth: "auto",
      className: classes.topTableItem,
      format: dateFormat,
    },
    {
      id: "referenceId",
      label: "REFERENCE NUMBER",
      minWidth: "auto",
      className: classes.topTableItem,
    },
  ];

  const columns = [
    {
      id: "id",
      label: "PRODUCT ID",
      minWidth: "auto",
      className: "",
    },
    {
      id: "name",
      label: "PRODUCT",
      minWidth: "auto",
      className: "",
    },
    {
      id: "uom",
      label: "UOM",
      minWidth: "auto",
      className: "",
      format: (value, entity) => entity.UOM.name,
    },
    {
      id: "weight",
      label: "WEIGHT",
      minWidth: "auto",
      className: "",
      format: (value, entity) => entity.weight + " Kg",
    },
    {
      id: "qunaityt",
      label: "QUANTITY",
      minWidth: "auto",
      className: "",
      format: (value, entity) => entity.InwardGroup.quantity,
    },
  ];

  // if(selectedInbound){console.log(selectedInbound)}

  return selectedInbound ? (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} maxWidth="lg" aria-labelledby="form-dialog-title">
          <DialogContent className={classes.dialogContent} style={{ padding: 0, minHeight: "80vh" }}>
            <Box display="none" displayPrint="block">
              <Box style={{ padding: "0mm 0mm" }}>
                  <img style={{ width: "20%", margin: "20px 0px" }} src={owareLogo} />
                  <Typography style={{  marginBottom: "10px", marginTop: "10px" }} variant="h3">
                    Inward Details
                  </Typography>
                  <Grid container item xs={12} style={{ marginTop: 20 }} justifyContent="space-between">
                    <Grid container spacing={2}>
                      <Grid style={{ fontWeight: 500 }} item xs={3}>
                        Inward ID :
                      </Grid>
                      <Grid item xs={3} style={{ fontStyle: "italic" }}>
                        {selectedInbound.internalIdForBusiness || "-"}
                      </Grid>
                      <Grid style={{ fontWeight: 500 }} item xs={3}>
                        Warehouse :
                      </Grid>
                      <Grid item xs={3} style={{ fontStyle: "italic" }}>
                        {selectedInbound.Warehouse.name || "-"}
                      </Grid>
                      <Grid style={{ fontWeight: 500 }} item xs={3}>
                        City :
                      </Grid>
                      <Grid item xs={3} style={{ fontStyle: "italic" }}>
                        {selectedInbound.Warehouse.city || "-"}
                      </Grid>
                      <Grid style={{ fontWeight: 500 }} item xs={3}>
                        Date of Inward :
                      </Grid>
                      <Grid item xs={3} style={{ fontStyle: "italic" }}>
                        {dateFormat(selectedInbound.createdAt) || "-"}
                      </Grid>
                      <Grid style={{ fontWeight: 500 }} item xs={3}>
                        Reference Number :
                      </Grid>
                      <Grid item xs={3} style={{ fontStyle: "italic" }}>
                        {selectedInbound.referenceId || "-"}
                      </Grid>
                    
                    </Grid>
                  </Grid>
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
                        {selectedInbound.Products.map((product, index) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                              {columns.map((column, index) => {
                                const value = product[column.id];
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
                                    {column.format ? column.format(value, product) : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                </Box>
            </Box>

            <Box display="block" displayPrint="none">
              <img style={{ width: "22%", margin: "20px 0px" }} src={owareLogo} />
              <Typography style={{ marginLeft: "10px", marginBottom: "10px", marginTop: "10px" }} variant="h3">
                Inward Details
                <Box display="inline" displayPrint="none">
                  <PrintOutlinedIcon className={classes.icon} onClick={() => window.print()} />
                </Box>
              </Typography>

              <TableContainer className={classes.tableContainerTop}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    {columnsTop.map((column, index) => (
                      <TableCell key={index} align={column.align} className={classes.tableHeaderItem}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableHead>
                  <TableBody>
                    <TableRow role="checkbox" tabIndex={-1} key={selectedInbound.id}>
                      {columnsTop.map((column) => {
                        const value = selectedInbound[column.id];
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
                            {column.format ? column.format(value, selectedInbound) : value || ""}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {/* </Box> */}

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
                    {selectedInbound.Products.map((product, index) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                          {columns.map((column, index) => {
                            const value = product[column.id];
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
                                {column.format ? column.format(value, product) : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
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
  ) : (
    ""
  );
}

export default InboundDetails;
