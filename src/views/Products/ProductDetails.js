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
  Grid,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { dateFormatWithoutTime, getURL } from "../../utils/common";
import owareLogo from "../../assets/logo/oware-logo-black.png";
import PrintOutlinedIcon from "@material-ui/icons/PrintOutlined";

const useStyles = makeStyles({
  tableContainerTop: {
    backgroundColor: "#F8F8F8",
    paddingLeft: 30,
    paddingRight: 20,
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
});
function ProductDetails({ open, handleClose, selectedProduct }) {
  const classes = useStyles();
  const columnsTop = [
    // {
    //   id: "id",
    //   label: "PRODUCT ID",
    //   minWidth: "auto",
    //   className: classes.topTableItem,
    //   // format: (value, entity) => entity.Product.id,
    // },
    {
      id: "Product.name",
      label: "PRODUCT NAME",
      minWidth: "auto",
      className: classes.topTableItem,
      format: (value, entity) => entity.Product.name,
    },
    {
      id: "category",
      label: "CATEGORY",
      minWidth: "auto",
      className: classes.topTableItem,
      format: (value, entity) => entity.Product.Category.name,
    },
    {
      id: "Warehouse.name",
      label: "WAREHOUSE",
      minWidth: "auto",
      className: classes.topTableItem,
      format: (value, entity) => entity.Warehouse.name,
    },
    {
      id: "brand",
      label: "BRAND",
      minWidth: "auto",
      className: classes.topTableItem,
      format: (value, entity) => entity.Product.Brand.name,
    },
    {
      id: "uom",
      label: "UOM",
      minWidth: "auto",
      className: classes.topTableItem,
      format: (value, entity) => entity.Product.UOM.name,
    },
    {
      id: "availableQuantity",
      label: "QUANTITY AVAILABLE",
      minWidth: "auto",
      className: classes.topTableItem,
    },
    {
      id: "committedQuantity",
      label: "QUANTITY COMMITTED",
      minWidth: "auto",
      className: classes.topTableItem,
    },
    {
      id: "dispatchedQuantity",
      label: "QUANTITY DISPATCHED",
      minWidth: "auto",
      className: classes.topTableItem,
    },

    // {
    //   id: "manuDate",
    //   label: "MANUFACTURING DATE",
    //   minWidth: "auto",
    //   className: classes.topTableItem,
    //   format: (value, format) => '-'
    // },
    // {
    //   id: "expDate",
    //   label: "EXPIRY DATE",
    //   minWidth: "auto",
    //   className: classes.topTableItem,
    //   format: (value, format) => '-'
    // },
    // {
    //   id: "batchNumber",
    //   label: "BATCH NUMBER",
    //   minWidth: "auto",
    //   className: classes.topTableItem,
    //   format: (value, format) => '-'
    // },
    // {
    //   id: "batchName",
    //   label: "BATCH NAME",
    //   minWidth: "auto",
    //   className: classes.topTableItem,
    //   format: (value, format) => '-'
    // },
  ];

  const columns = [
    {
      id: "batchNumber",
      label: "BATCH NUMBER",
      minWidth: "auto",
      className: "",
      format: (value, entity) => (entity ? entity.batchNumber || '-' : "-"),
    },
    // {
    //   id: "batchName",
    //   label: "BATCH NAME",
    //   minWidth: "auto",
    //   className: "",
    //   format: (value, entity) => entity.batchName,
    // },
    {
      id: "availableQuantity",
      label: "AVAILABLE QUANTITY",
      minWidth: "auto",
      className: "",
    },
    {
      id: "outwardQuantity",
      label: "DISPATCHED QUANTITY",
      minWidth: "auto",
      className: "",
      format: (value, entity) => entity.outwardQuantity,
    },
    {
      id: "manuDate",
      label: "MANUFACTURING DATE",
      minWidth: "auto",
      className: "",
      format: (value, entity) => {
        return dateFormatWithoutTime(entity.manufacturingDate);
      },
    },
    {
      id: "expDate",
      label: "EXPIRY DATE",
      minWidth: "auto",
      className: "",
      format: (value, entity) => {
        return dateFormatWithoutTime(entity.expiryDate);
      },
    },
  ];

  const [selectedProductDetails, setSelectedProductDetails] = useState([]); // inv details

  useEffect(() => {
    if (selectedProduct)
      axios
        .get(getURL(`/product/batches/${selectedProduct.id}`))
        .then((response) => {
          setSelectedProductDetails(response.data.batches);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [selectedProduct]);

  return selectedProduct ? (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="lg"
          aria-labelledby="form-dialog-title"
        >
          <DialogContent
            className={classes.dialogContent}
            style={{ padding: 0, minHeight: "80vh" }}
          >
            {/* For Print View */}
            <Box display="none" displayPrint="block">
              <Box style={{ padding: "0mm 0mm" }}>
                <img
                  style={{ width: "20%", margin: "20px 0px" }}
                  src={owareLogo}
                />
                <Typography
                  style={{ marginBottom: "10px", marginTop: "10px" }}
                  variant="h3"
                >
                  Product Details
                </Typography>

                {/* <Box display="none" displayPrint="block"> */}
                <Grid
                  container
                  item
                  xs={12}
                  style={{ marginTop: 20 }}
                  justifyContent="space-between"
                >
                  <Grid container spacing={0} style={{ gridRowGap: "5px" }}>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Product Name :
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ fontStyle: "italic", textAlign: "center" }}
                    >
                      {selectedProduct.Product.name || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Category :
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ fontStyle: "italic", textAlign: "center" }}
                    >
                      {selectedProduct.Product.Category.name || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Warehouse:
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ fontStyle: "italic", textAlign: "center" }}
                    >
                      {selectedProduct.Warehouse.name || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Brand :
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ fontStyle: "italic", textAlign: "center" }}
                    >
                      {selectedProduct.Product.Brand.name || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      UOM :
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ fontStyle: "italic", textAlign: "center" }}
                    >
                      {selectedProduct.Product.UOM.name || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Quantity Available :
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ fontStyle: "italic", textAlign: "center" }}
                    >
                      {selectedProduct.availableQuantity || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Quantity Committed :
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ fontStyle: "italic", textAlign: "center" }}
                    >
                      {selectedProduct.committedQuantity || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Quantity Dispatched :
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ fontStyle: "italic", textAlign: "center" }}
                    >
                      {selectedProduct.dispatchedQuantity || "-"}
                    </Grid>
                  </Grid>
                </Grid>

                <Typography
                  style={{ marginBottom: "10px", marginTop: "20px" }}
                  variant="h3"
                >
                  Batch Details
                </Typography>
                <Grid
                  container
                  item
                  xs={12}
                  style={{ marginTop: 20 }}
                  justifyContent="space-between"
                >
                  <Grid
                    container
                    spacing={0}
                    style={{ gridRowGap: "5px", marginTop: 25 }}
                  >
                    {selectedProductDetails.map((prodDetail) => {
                      return (
                        <>
                          <Grid style={{ fontWeight: 500 }} item xs={3}>
                            Batch Number :
                          </Grid>
                          <Grid
                            item
                            xs={3}
                            style={{ fontStyle: "italic", textAlign: "center" }}
                          >
                            {prodDetail.batchNumber || "-"}
                          </Grid>
                          {/* <Grid style={{ fontWeight: 500 }} item xs={3}>
                            Batch Name :
                          </Grid>
                          <Grid item xs={3} style={{ fontStyle: "italic", textAlign: 'center' }}>
                            {prodDetail.batchName || "-"}
                          </Grid> */}
                          <Grid style={{ fontWeight: 500 }} item xs={3}>
                            Available Quantity :
                          </Grid>
                          <Grid
                            item
                            xs={3}
                            style={{ fontStyle: "italic", textAlign: "center" }}
                          >
                            {prodDetail.availableQuantity || "-"}
                          </Grid>
                          <Grid style={{ fontWeight: 500 }} item xs={3}>
                            Dispatched Quantity :
                          </Grid>
                          <Grid
                            item
                            xs={3}
                            style={{ fontStyle: "italic", textAlign: "center" }}
                          >
                            {prodDetail.dispatchedQuantity || "-"}
                          </Grid>
                          <Grid style={{ fontWeight: 500 }} item xs={3}>
                            Manufacturing Date :
                          </Grid>
                          <Grid
                            item
                            xs={3}
                            style={{ fontStyle: "italic", textAlign: "center" }}
                          >
                            {prodDetail.manufacturingDate
                              ? dateFormatWithoutTime(
                                prodDetail.manufacturingDate
                              )
                              : "-"}
                          </Grid>
                          <Grid style={{ fontWeight: 500 }} item xs={3}>
                            Expiry Date :
                          </Grid>
                          <Grid
                            item
                            xs={3}
                            style={{ fontStyle: "italic", textAlign: "center" }}
                          >
                            {prodDetail.expiryDate
                              ? dateFormatWithoutTime(prodDetail.expiryDate)
                              : "-"}
                          </Grid>
                          <Grid item xs={3}></Grid>
                          <Grid item xs={3}></Grid>
                        </>
                      );
                    })}
                  </Grid>
                </Grid>
              </Box>
            </Box>

            <Box display="block" displayPrint="none">
              <img
                style={{ width: "15%", margin: "20px", marginLeft: "25px" }}
                src={owareLogo}
              />
              <Typography
                style={{
                  marginLeft: "40px",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
                variant="h3"
              >
                Product Details
                <Box display="inline" displayPrint="none">
                  <PrintOutlinedIcon
                    className={classes.icon}
                    onClick={() => window.print()}
                  />
                </Box>
              </Typography>
              <TableContainer className={classes.tableContainerTop}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    {columnsTop.map((column, index) => (
                      <TableCell
                        key={index}
                        align={column.align}
                        className={classes.tableHeaderItem}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableHead>
                  <TableBody>
                    <TableRow
                      role="checkbox"
                      tabIndex={-1}
                      key={selectedProduct.id}
                    >
                      {columnsTop.map((column) => {
                        const value = selectedProduct[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ paddingTop: "0" }}
                            className={
                              column.className &&
                                typeof column.className === "function"
                                ? column.className(value)
                                : column.className
                            }
                          >
                            {column.format
                              ? column.format(value, selectedProduct)
                              : value || "-"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            {selectedProductDetails && selectedProductDetails.length > 0 ? (
              <Box display="block" displayPrint="none">
                <TableContainer style={{ marginTop: "20px" }}>
                  <Table aria-label="collapsible table">
                    <TableHead>
                      {columns.map((column, index) => (
                        <TableCell
                          key={index}
                          align={column.align}
                          className={classes.tableHeaderItem}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableHead>
                    <TableBody role="checkbox" tabIndex={-1} key={"key"}>
                      {selectedProductDetails.map((prodDetail) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={prodDetail.id}
                          >
                            {columns.map((column) => {
                              const value = prodDetail[column.id];
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  className={
                                    column.className &&
                                      typeof column.className === "function"
                                      ? column.className(value)
                                      : column.className
                                  }
                                >
                                  {column.format
                                    ? column.format(value, prodDetail)
                                    : value || "-"}
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
            ) : (
              ""
            )}
          </DialogContent>

          <Box display="block" displayPrint="none">
            <DialogActions
              style={{ boxSizing: "border-box", padding: "10px 19px" }}
            >
              <Button
                variant="contained"
                className={classes.closeButton}
                onClick={handleClose}
                color="primary"
              >
                Close
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </form>
    </div>
  ) : null;
}

export default ProductDetails;
