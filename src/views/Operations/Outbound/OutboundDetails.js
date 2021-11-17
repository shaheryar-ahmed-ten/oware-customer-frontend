import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { dateFormat, getURL } from "../../../utils/common";
import owareLogo from "../../../assets/logo/oware-logo-black.png";
import PrintOutlinedIcon from "@material-ui/icons/PrintOutlined";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import "./OutboundDetail.css";
import clsx from "clsx";
// import { createContext } from "react";
import moment from "moment";

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
});
function OutboundDetails({ open, handleClose, selectedOutboundOrder }) {
  const classes = useStyles();
  const [orderId, setOrderId] = useState(0),
    [referenceId, setReferenceId] = useState(""),
    [date, setDate] = useState(""),
    [receiverName, setRecieverName] = useState(""),
    [recieverPhone, setRecieverPhone] = useState("");
  const [orderMemo, setOrderMemo] = useState("");
  // console.log(date);

  const columnsTop = [
    {
      id: "internalIdForBusiness",
      label: "ORDER ID",
      minWidth: "auto",
      className: classes.topTableItem,
    },
    {
      id: "shipmentDate",
      label: "ORDER DATE",
      minWidth: "auto",
      className: classes.topTableItem,
      format: dateFormat,
    },
    {
      id: "warehouse",
      label: "WAREHOUSE",
      minWidth: "auto",
      className: classes.topTableItem,
      format: (value, entity) => entity.Inventory.Warehouse.name,
    },
    {
      id: "referenceId",
      label: "REFERENCE ID",
      minWidth: "auto",
      className: classes.topTableItem,
    },
    {
      id: "recieverName",
      label: "Reciever Name",
      minWidth: "auto",
      className: classes.topTableItem,
      format: (value, entity) => entity.receiverName,
    },
    {
      id: "recieverPhone",
      label: "RECIEVER PHONE",
      minWidth: "auto",
      className: classes.topTableItem,
      format: (value, entity) => entity.receiverPhone,
    },
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
  const columns = [
    // {
    //     id: 'outwardId',
    //     label: 'OUTWARD ID',
    //     minWidth: 'auto',
    //     className: '',
    //     format: (value, po, outwardOrder, inventory) => inventory.OutwardGroup.outwardId
    // },
    {
      id: "createdAt",
      label: "OUTWARD DATE",
      minWidth: "auto",
      className: "",
      format: (value, po, outwardOrder, inventory) => dateFormat(inventory.OutwardGroup.createdAt),
    },
    {
      id: "internalIdForBusiness",
      label: "OUTWARD ID",
      minWidth: "auto",
      className: "",
      format: (value, po, outwardOrder, inventori) => po.internalIdForBusiness,
    },
    {
      id: "product",
      label: "PRODUCT",
      minWidth: "auto",
      className: "",
      format: (value, po, outwardOrder, inventory) => inventory.Product.name,
    },
    {
      id: "uom",
      label: "UOM",
      minWidth: "auto",
      className: "",
      format: (value, po, outwardOrder, inventory) => inventory.Product.UOM.name,
    },
    {
      id: "quantity",
      label: "QUANTITY REQUESTED",
      minWidth: "auto",
      className: "",
      format: (value, po, outwardOrder, inventory) => {
        const DistpatchInventory = outwardOrder.Inventories.find(
          (doInventory) => doInventory.OrderGroup.inventoryId === inventory.OutwardGroup.inventoryId
        );
        return DistpatchInventory.OrderGroup.quantity;
      },
    },
    // {
    //     id: 'availablequantity',
    //     label: 'AVAILABLE REQUESTED',
    //     minWidth: 'auto',
    //     className: '',
    //     format: (value, po, outwardOrder, inventory) => {
    //         const DistpatchInventory = outwardOrder.Inventories.find((doInventory) => doInventory.OrderGroup.inventoryId === inventory.OutwardGroup.inventoryId)
    //         return (
    //             inventory.OutwardGroup.availableQuantity || 'Not available'
    //         )
    //     }
    // },
    {
      id: "quantity",
      label: "QUANTITY SHIPPED",
      minWidth: "auto",
      className: "",
      format: (value, po, outwardOrder, inventory) => inventory.OutwardGroup.quantity,
    },
    {
      id: "number",
      label: "VEHICLE #",
      minWidth: "auto",
      className: "",
      format: (value, entity) => (entity.Vehicle ? entity.Vehicle.registrationNumber : ""),
    },
  ];
  const pendingColumns = [
    {
      id: "product",
      label: "PRODUCT",
      minWidth: "auto",
      className: "",
      format: (value, inventory) => inventory.Product.name || "",
    },
    {
      id: "uom",
      label: "UOM",
      minWidth: "auto",
      className: "",
      format: (value, inventory) => inventory.Product.UOM.name || "",
    },
    {
      id: "weight",
      label: "WEIGHT",
      minWidth: "auto",
      className: "",
      format: (value, inventory) => inventory.Product.weight + " Kg" || "",
    },
    {
      id: "quantity",
      label: "REQUSTED QUANTITY",
      minWidth: "auto",
      className: "",
      format: (value, inventory) => inventory.OrderGroup.quantity || "",
    },
  ];

  const [selectedProductOutwardDetails, setSelectedProductOutwardDetails] = useState([]);
  const [productOutwardsLength, setProductOutwardsLength] = useState(0);

  useEffect(() => {
    if (selectedOutboundOrder)
      axios
        .get(getURL(`/order/${selectedOutboundOrder.id}`))
        .then((response) => {
          if (response.data.success) {
            // console.log(response.data.data)
            setSelectedProductOutwardDetails(response.data.data);
            setProductOutwardsLength(response.data.data[0].ProductOutwards.length);
            setDate(moment(response?.data?.data[0]?.updatedAt));
            setRecieverName(
              response.data.data
                ? response.data.data.map((name) => {
                    return name.receiverName;
                  })
                : []
            );
            setRecieverPhone(
              response.data.data
                ? response.data.data.map((phone) => {
                    return phone.receiverPhone;
                  })
                : []
            );
            setOrderId(
              response.data.data
                ? response.data.data.map((id) => {
                    return id.internalIdForBusiness;
                  })
                : []
            );
            setReferenceId(
              response.data.data
                ? response.data.data.map((refid) => {
                    return refid.referenceId;
                  })
                : []
            );
            setOrderMemo(selectedOutboundOrder.orderMemo || null);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  }, [selectedOutboundOrder]);

  function createData(orderId, dispatchDate, receiverName, recieverPhone, referenceId) {
    return {
      orderId,
      dispatchDate,
      receiverName,
      recieverPhone,
      referenceId,
    };
  }

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);
    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.orderId}
          </TableCell>
          <TableCell align="right">{row.dispatchDate}</TableCell>
          <TableCell align="right">{row.receiverName}</TableCell>
          <TableCell align="right">{row.recieverPhone}</TableCell>
          <TableCell align="right">{row.referenceId}</TableCell>
        </TableRow>

        {productOutwardsLength !== 0 ? (
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box margin={1}>
                  <Typography variant="h4" gutterBottom component="div">
                    Product Details
                  </Typography>
                  <Table size="small" aria-label="purchases">
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
                      {selectedProductOutwardDetails.map((outwardOrder) => {
                        return outwardOrder.ProductOutwards.map((productOutward) => {
                          return productOutward.Inventories.map((poInventory) => {
                            return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={poInventory.id}>
                                {columns.map((column) => {
                                  const value = poInventory[column.id];
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
                                      {column.format
                                        ? column.format(value, productOutward, outwardOrder, poInventory)
                                        : value || ""}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          });
                        });
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }

  const rows = [createData(orderId, dateFormat(date), receiverName, recieverPhone, referenceId)];

  return selectedOutboundOrder ? (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} maxWidth="lg" aria-labelledby="form-dialog-title">
          <DialogContent style={{ padding: 0, minHeight: "80vh" }}>
            <img style={{ width: "16%", margin: "20px" }} src={owareLogo} />
            <Typography style={{ marginLeft: "10px", marginBottom: "10px" , marginTop: "10px"}} variant="h3">
              Order Details
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
                  <TableRow role="checkbox" tabIndex={-1} key={selectedOutboundOrder.id}>
                    {columnsTop.map((column) => {
                      const value = selectedOutboundOrder[column.id];
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
                          {column.format ? column.format(value, selectedOutboundOrder) : value || ""}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Grid item xs={12} style={{ marginTop: "12px" }}>
              <Grid item xs={12}>
                <Typography style={{ marginLeft: "10px", marginBottom: "10px" }} variant="h4">
                  Order Memo
                </Typography>
              </Grid>
              <Grid item xs={12} style={{ marginLeft: "15px", marginBottom: "10px" }}>
                {orderMemo || "-"}
              </Grid>
            </Grid>

            {productOutwardsLength !== 0 ? (
              <TableContainer style={{ marginTop: "20px" }}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Order Id</TableCell>
                      <TableCell>Dispatch Date</TableCell>
                      <TableCell align="right">Reciever Name</TableCell>
                      <TableCell align="right">Rceiever Phone</TableCell>
                      <TableCell align="right">Reference Id</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <Row key={row.dispatchDate} row={row} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer style={{ marginTop: "20px" }}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell>PRODUCT</TableCell>
                      <TableCell>UOM</TableCell>
                      <TableCell align="right">WEIGHT</TableCell>
                      <TableCell align="right">REQUESTED QUANTITY</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody role="checkbox" tabIndex={-1} key={selectedOutboundOrder.id}>
                    {selectedOutboundOrder.Inventories.map((inventory) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={inventory.id}>
                          {pendingColumns.map((column) => {
                            const value = inventory[column.id];
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
                                {column.format ? column.format(value, inventory) : value || ""}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <Box display="block" displayPrint="none">
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

export default OutboundDetails;
