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
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getURL } from "../../utils/common";
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
      id: "availableQuantity",
      label: "QUANTITY AVAILABLE",
      minWidth: "auto",
      className: classes.topTableItem,
    },
    {
      id: "committedQuantity",
      label: "QUANTITY COMMITED",
      minWidth: "auto",
      className: classes.topTableItem,
    },
    {
      id: "dispatchedQuantity",
      label: "QUANTITY DISPATCHED",
      minWidth: "auto",
      className: classes.topTableItem,
    },
  ];
  // const columns = [
  //     {
  //         id: 'Warehouse.name',
  //         label: 'WAREHOUSE',
  //         minWidth: 'auto',
  //         className: '',
  //         format: (value, entity) => entity.Warehouse.name,
  //     },
  //     {
  //         id: 'availableQuantity',
  //         label: 'QUANTITY AVAILABLE',
  //         minWidth: 'auto',
  //         className: '',
  //     },
  //     {
  //         id: 'committedQuantity',
  //         label: 'QUANTITY COMMITED',
  //         minWidth: 'auto',
  //         className: '',
  //     },
  // ]
  const [selectedProductDetails, setSelectedProductDetails] = useState([]);
  useEffect(() => {
    if (selectedProduct)
      axios
        .get(getURL(`/product/${selectedProduct.id}`))
        .then((response) => {
          setSelectedProductDetails(response.data.data);
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
            <img style={{ width: "15%", margin: "20px", marginLeft: "45px" }} src={owareLogo} />
            <Typography style={{ marginLeft: "40px", marginBottom: "10px", marginTop: "10px" }} variant="h3">
              Product Details
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

export default ProductDetails;
