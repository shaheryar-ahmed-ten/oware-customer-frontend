import { useState, useEffect } from 'react';
import {Grid, Button, TextField, FormControl, Typography, TableContainer, Table,TableHead, TableRow, TableCell, TableBody, Box,makeStyles} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import { Alert } from '@material-ui/lab';
import { isPhone, isRequired } from '../../../utils/validators';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import { checkForMatchInArray, dateToPickerFormat, getURL } from '../../../utils/common';
import { useLocation, useNavigate } from 'react-router';
import MessageSnackbar from '../../../components/MessageSnackBar';

const useStyles = makeStyles((theme) => ({
  heading: {
      fontWeight: "600"
  }, 
  parentContainer: {
    boxSizing: 'border-box',
    padding: "30px 30px"
  },
  gridContainer: {
      boxSizing: 'border-box',
      [theme.breakpoints.up('lg')]: {
          paddingRight: 30,
          paddingTop: 30,
          paddingBottom: 30
      },
  },
  tableContainer: {
    backgroundColor: 'white' ,
    padding : "30px" 
},
shadedTableHeader: {
  backgroundColor: 'rgba(202,201,201,0.3)'
},
tableHeadText: {
  background: 'transparent', fontWeight: 'bolder', fontSize: '12px'
}

}));

export default function AddProductOutwardView() {
  const classes = useStyles();
  const navigate = useNavigate();

  const 
  [referenceId, setReferenceId] = useState(''),
  [warehouseId, setWarehouseId] = useState(''),
  [uom, setUom] = useState(''),
  [productId, setProductId] = useState(''),
  [quantity, setQuantity] = useState(0),
  [productGroups, setProductGroups] = useState([]),
  [products, setProducts] = useState([]),
  [warehouses, setWarehouses] = useState([]),
  [receiverName, setReceiverName] = useState(''),
  [formErrors, setFormErrors] = useState([]),
  [internalIdForBusiness, setInternalIdForBusiness] = useState(''),
  [receiverPhone, setReceiverPhone] = useState(''),
  [dispatchOrders, setDispatchOrders] = useState([]),
  [dispatchOrderId, setDispatchOrderId] = useState(''),
  [shipmentDate, setShipmentDate] = useState(dateToPickerFormat(new Date())),
  [showMessage, setShowMessage] = useState(null),
  [messageType, setMessageType] = useState(null),
  [validation, setValidation] = useState({});

  useEffect(() => {
    getRelations();
  }, []);

  const getRelations = () => {
    axios.get(getURL('/inward/relations'))
      .then(res => {
        setProducts(res.data.relations.products)
        setWarehouses(res.data.relations.warehouses)
        setDispatchOrders(res.data.relations.dispatchOrders);
      });
  };

  const selectProduct = value => {
    setProductId(value);
  }

  useEffect(() => {
  }, [productGroups]);

  const updateProductsTable = () => {
    if (isRequired(quantity) &&
      isRequired(productId) &&
      isRequired(warehouseId)) {
      // checking if particular product is already added once
      // if yes
      if (checkForMatchInArray(productGroups, "id", productId)) {
        setMessageType('#FFCC00')
        setShowMessage({ message: "This product is already added, please choose a different one." })
      }
      // if no
      else {
        setProductGroups([...productGroups, {
          product: products.find(_product => _product.id == productId),
          id: productId,
          quantity
        }])
      }
    }
    else {
      setValidation({
        quantity: true,
        referenceId: true,
        productId: true,
        warehouseId: true,
        receiverName: true,
        receiverPhone: true,
        dispatchOrderId: true,
        vehicleId: true
      });
    }
  }

  const addProductOutward = data => {
    let apiPromise = null;
    apiPromise = axios.post(getURL('/outward'), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
        return
      }
      setShowMessage({
        message: "New products outward have been created."
      });
      setTimeout(() => {
        navigate('/operation-transactions/orders')
      }, 2000);
    })
      .catch((err) => {
        console.log(err)
      });
  };

  const handleSubmit = e => {
    setMessageType('green')
    const newProductOutward = {
      productId,
      quantity,
      warehouseId,
      referenceId,
      shipmentDate,
      receiverName,
      receiverPhone,
    }

    setValidation({
      quantity: true,
      productId: true,
      shipmentDate: true,
      receiverName: true,
      receiverPhone: true,
      warehouseId: true,
      dispatchOrderId: true,
      vehicleId: true
    });
    if (isRequired(quantity) &&
       isRequired(dispatchOrderId)
      && isRequired(productId) &&
      isRequired(warehouseId)) {
      addProductOutward(newProductOutward);
    }
  }

  return (
    <>
      {formErrors}
        <Grid container spacing={3} className={classes.parentContainer}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        <Box className={classes.heading}>Add Outwards</Box>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer className={classes.tableContainer}>
                     <Grid item sm={12}>
          <FormControl margin="dense" fullWidth={true} variant="outlined">
            <Autocomplete
              id="warehouse"
              options={warehouses}
              getOptionLabel={(warehouse) => warehouse.name}
              onChange={(event, newValue) => {
                if (newValue) {
                  setWarehouseId(newValue.id);
                  setInternalIdForBusiness(`PI-${newValue.businessWarehouseCode}-`);
                }
              }}
              renderInput={(params) => <TextField {...params} label="Warehouse" variant="outlined" />}
            />
           
          </FormControl>
        </Grid>

        <Grid item sm={12}>
          <FormControl margin="dense" fullWidth={true} variant="outlined">
            <Autocomplete
              id="vehicle"
              options={warehouses}
              getOptionLabel={(warehouse) => warehouse.name}
              onChange={(event, newValue) => {
                if (newValue) {
                  setWarehouseId(newValue.id);
                }
              }}
              renderInput={(params) => <TextField {...params} label="Vehicle" variant="outlined" />}
            />
           
          </FormControl>
        </Grid>

        <Grid item sm={12}>
          <TextField
            fullWidth={true}
            margin="dense"
            id="receiverName"
            label="Receiver Name"
            type="text"
            variant="outlined"
            value={receiverName}
            onChange={e => setReceiverName(e.target.value)}
            onBlur={e => setValidation({ ...validation, receiverName: true })}
          />
          {validation.receiverName && !isRequired(receiverName) ? <Typography color="error">Receiver name is required!</Typography> : ''}
        </Grid>
        <Grid item sm={12}>
          <TextField
            fullWidth={true}
            margin="dense"
            id="receiverPhone"
            label="Receiver Phone"
            type="text"
            variant="outlined"
            value={receiverPhone}
            placeholder="0346xxxxxx8"
            onChange={e => setReceiverPhone(e.target.value)}
            onBlur={e => setValidation({ ...validation, receiverPhone: true })}
          />
          {validation.receiverPhone && !isRequired(receiverPhone) ? <Typography color="error">Receiver phone is required!</Typography> : ''}
          {validation.receiverPhone && !isPhone(receiverPhone) ? <Typography color="error">Incorrect phone number!</Typography> : ''}
        </Grid>
        <Grid item sm={12}>
          <TextField
            fullWidth={true}
            margin="dense"
            id="datetime-local"
            label="Shipment Date"
            placeholder="Shipment Date"
            type="datetime-local"
            variant="outlined"
            value={shipmentDate}
            onChange={e => setShipmentDate(dateToPickerFormat(e.target.value))}
            onBlur={e => setValidation({ ...validation, shipmentDate: true })}
          />
          {validation.shipmentDate && !isRequired(shipmentDate) ? <Typography color="error">Shipment date is required!</Typography> : ''}
        </Grid>
       
        <Grid item sm={12}>
          <TextField
            fullWidth={true}
            margin="dense"
            id="referenceId"
            label="Reference Id"
            type="text"
            variant="outlined"
            value={referenceId}
            onChange={e => setReferenceId(e.target.value)}
            inputProps={{ maxLength: 30 }}
          />
        </Grid>

          <Grid container className={classes.parentContainer} xs={12} spacing={3}>
            <Grid item xs={3}>
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <Button style = {{textAlign: "right"}} onClick={handleSubmit} color="primary" variant="contained">
                   Save
                </Button>
              </FormControl>
            </Grid>
          </Grid>

               <MessageSnackbar showMessage={showMessage} type={messageType} />
                    </TableContainer>
                
                </Grid>
           
            </Grid>
        
    </>
  );
}
