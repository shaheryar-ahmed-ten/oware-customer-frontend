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
import React from "react";
import { dateFormat, dividerDateFormat } from "../../../utils/common";
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
      id: "vehicleType",
      label: "VEHICLE TYPE",
      minWidth: "auto",
      className: classes.topTableItem,
    },
    {
      id: "vehicleNumber",
      label: "VEHICLE NUMBER",
      minWidth: "auto",
      className: classes.topTableItem,
    },
    {
      id: "vehicleName",
      label: "VEHICLE NAME",
      minWidth: "auto",
      className: classes.topTableItem,
    },
    {
      id: "driverName",
      label: "DRIVER NAME",
      minWidth: "auto",
      className: classes.topTableItem,
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
    {
      id: "batchQuantity",
      label: "BATCH QUANTITY",
      minWidth: "auto",
      className: "",
      format: (value, entity, invDetail) => {
        return invDetail &&
          invDetail.InwardGroup.find(
            (invGrp) =>
              invGrp.InwardGroupBatch.inventoryDetailId == invDetail.id
          )
          ? invDetail.InwardGroup.find(
            (invGrp) =>
              invGrp.InwardGroupBatch.inventoryDetailId == invDetail.id
          ).InwardGroupBatch.quantity
          : "-";
      },
    },
    {
      id: "manuDate",
      label: "MANUFACTURING DATE",
      minWidth: "auto",
      className: classes.topTableItem,
      format: (value, entity, invDetail) => {
        // var invGrp = InwardGroup.find(
        //   (invGroup) => invGroup.productId === entity.InwardGroup.productId
        // );
        return invDetail && invDetail.manufacturingDate
          ? dividerDateFormat(invDetail.manufacturingDate)
          : "-";
      },
    },
    {
      id: "expiryDate",
      label: "EXPIRY DATE",
      minWidth: "auto",
      className: classes.topTableItem,
      format: (value, entity, invDetail) => {
        // var invGrp = InwardGroup.find(
        //   (invGroup) => invGroup.productId === entity.InwardGroup.productId
        // );
        return invDetail && invDetail.expiryDate
          ? dividerDateFormat(invDetail.expiryDate)
          : "-";
      },
    },
    {
      id: "batchNo",
      label: "BATCH NUMBER",
      minWidth: "auto",
      className: classes.topTableItem,
      format: (value, entity, invDetail) => {
        // var invGrp = InwardGroup.find(
        //   (invGroup) => invGroup.productId === entity.InwardGroup.productId
        // );
        return invDetail && invDetail.batchNumber ? invDetail.batchNumber : "-";
      },
    },
    // {
    //   id: "batchName",
    //   label: "BATCH NAME",
    //   minWidth: "auto",
    //   className: classes.topTableItem,
    //   format: (value, entity, invDetail) => {
    //     // var invGrp = InwardGroup.find(
    //     //   (invGroup) => invGroup.productId === entity.InwardGroup.productId
    //     // );
    //     return invDetail && invDetail.batchName ? invDetail.batchName : "-";
    //   },
    // },
  ];

  // if(selectedInbound){console.log(selectedInbound)}

  return selectedInbound ? (
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
            <Box display="none" displayPrint="block">
              <Box style={{ marginLeft: "1%", overflow: "hidden" }}>
                <img
                  style={{ width: "20%", margin: "20px 0px" }}
                  src={owareLogo}
                />
                <Typography
                  style={{ marginBottom: "10px", marginTop: "10px" }}
                  variant="h3"
                >
                  Inward Details
                </Typography>
                <Grid
                  container
                  item
                  xs={12}
                  style={{ marginTop: 20 }}
                  justifyContent="space-between"
                >
                  <Grid container spacing={1}>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Inward ID :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic", textAlign: 'center' }}>
                      {selectedInbound.internalIdForBusiness || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Warehouse :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic", textAlign: 'center' }}>
                      {selectedInbound.Warehouse.name || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      VehicleType :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic", textAlign: 'center' }}>
                      {selectedInbound.vehicleType || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      VehicleName :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic", textAlign: 'center' }}>
                      {selectedInbound.vehicleName || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      VehicleNumber :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic", textAlign: 'center' }}>
                      {selectedInbound.vehicleName || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      DriverName :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic", textAlign: 'center' }}>
                      {selectedInbound.driverName || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Date of Inward :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic", textAlign: 'center' }}>
                      {dateFormat(selectedInbound.createdAt) || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Reference Number :
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic", textAlign: 'center' }}>
                      {selectedInbound.referenceId || "-"}
                    </Grid>
                    <Grid style={{ fontWeight: 500 }} item xs={3}>
                      Memo:
                    </Grid>
                    <Grid item xs={3} style={{ fontStyle: "italic", textAlign: 'center' }}>
                      {selectedInbound.memo || "-"}
                    </Grid>
                  </Grid>
                </Grid>
                <Typography
                  style={{ marginBottom: "10px", marginTop: "40px" }}
                  variant="h3"
                >
                  Product Details
                </Typography>
                <Grid
                  container
                  item
                  xs={12}
                  style={{ marginTop: 20 }}
                  justifyContent="space-between"
                >
                  <Grid container spacing={0} style={{ gridRowGap: '5px' }}>
                    {selectedInbound.Products.map((product) => {
                      return product.InwardGroup.InventoryDetail.map(
                        (batch, index) => {
                          // console.log(":-batch", batch);
                          // console.log(":-batch.batchName", batch.batchName);
                          return (
                            <>
                              <Grid container item xs={12}>
                                <Grid style={{ fontWeight: 500 }} item xs={6}>
                                  Product ID :
                                </Grid>
                                <Grid
                                  item
                                  xs={6}
                                  style={{
                                    fontStyle: "italic", textAlign: 'center',
                                    textAlign: "center",
                                  }}
                                >
                                  {product.id || "-"}
                                </Grid>
                                <Grid style={{ fontWeight: 500 }} item xs={6}>
                                  Product :
                                </Grid>
                                <Grid
                                  item
                                  xs={6}
                                  style={{
                                    fontStyle: "italic", textAlign: 'center',
                                    textAlign: "center",
                                  }}
                                >
                                  {product.name || "-"}
                                </Grid>
                                <Grid style={{ fontWeight: 500 }} item xs={6}>
                                  UoM :
                                </Grid>
                                <Grid
                                  item
                                  xs={6}
                                  style={{
                                    fontStyle: "italic", textAlign: 'center',
                                    textAlign: "center",
                                  }}
                                >
                                  {product.UOM.name || "-"}
                                </Grid>
                                <Grid style={{ fontWeight: 500 }} item xs={6}>
                                  Weight :
                                </Grid>
                                <Grid
                                  item
                                  xs={6}
                                  style={{
                                    fontStyle: "italic", textAlign: 'center',
                                    textAlign: "center",
                                  }}
                                >
                                  {product.weight || "-"}
                                </Grid>
                                <Grid style={{ fontWeight: 500 }} item xs={6}>
                                  Quantity :
                                </Grid>
                                <Grid
                                  item
                                  xs={6}
                                  style={{
                                    fontStyle: "italic", textAlign: 'center',
                                    textAlign: "center",
                                  }}
                                >
                                  {batch.InwardGroup[0].InwardGroupBatch
                                    .quantity || "-"}
                                </Grid>
                                <Grid style={{ fontWeight: 500 }} item xs={6}>
                                  Manufacturing Date :
                                </Grid>
                                <Grid
                                  item
                                  xs={6}
                                  style={{
                                    fontStyle: "italic", textAlign: 'center',
                                    textAlign: "center",
                                  }}
                                >
                                  {dividerDateFormat(batch.manufacturingDate) ||
                                    "-"}
                                </Grid>
                                <Grid style={{ fontWeight: 500 }} item xs={6}>
                                  Expiry Date :
                                </Grid>
                                <Grid
                                  item
                                  xs={6}
                                  style={{
                                    fontStyle: "italic", textAlign: 'center',
                                    textAlign: "center",
                                  }}
                                >
                                  {dividerDateFormat(batch.expiryDate) || "-"}
                                </Grid>
                                <Grid style={{ fontWeight: 500 }} item xs={6}>
                                  Batch Number :
                                </Grid>
                                <Grid
                                  item
                                  xs={6}
                                  style={{
                                    fontStyle: "italic", textAlign: 'center',
                                    textAlign: "center",
                                  }}
                                >
                                  {batch.batchNumber || "-"}
                                </Grid>
                                {/* <Grid style={{ fontWeight: 500 }} item xs={6}>
                                  Batch Name :
                                </Grid> */}
                                {/* <Grid
                                  item
                                  xs={6}
                                  style={{
                                    fontStyle: "italic", textAlign:'center',
                                    textAlign: "center",
                                  }}
                                >
                                  {batch.batchName || "-"}
                                </Grid> */}
                              </Grid>
                            </>
                          );
                        }
                      );
                    })}
                  </Grid>
                </Grid>
              </Box>
            </Box>

            <Box display="block" displayPrint="none">
              <img
                style={{ width: "22%", margin: "20px 0px" }}
                src={owareLogo}
              />
              <Typography
                style={{
                  marginLeft: "10px",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
                variant="h3"
              >
                Inward Details
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
                      key={selectedInbound.id}
                    >
                      {columnsTop.map((column) => {
                        const value = selectedInbound[column.id];
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
                              ? column.format(value, selectedInbound)
                              : value || "-"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Grid item xs={12} style={{ marginTop: "12px" }}>
                <Grid item xs={12}>
                  <Typography
                    style={{ marginLeft: "10px", marginBottom: "10px" }}
                    variant="h4"
                  >
                    Inward Memo
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{ marginLeft: "15px", marginBottom: "10px" }}
                >
                  {selectedInbound.memo || "-"}
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
                      return product.InwardGroup.InventoryDetail.map(
                        (invDetail) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={index}
                            >
                              {columns.map((column, index) => {
                                const value = product[column.id];
                                return (
                                  <TableCell
                                    key={index}
                                    align={column.align}
                                    className={
                                      column.className &&
                                        typeof column.className === "function"
                                        ? column.className(value)
                                        : column.className
                                    }
                                  >
                                    {column.format
                                      ? column.format(value, product, invDetail)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        }
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </DialogContent>
          <Box display="inline" displayPrint="none">
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
  ) : (
    ""
  );
}

export default InboundDetails;
