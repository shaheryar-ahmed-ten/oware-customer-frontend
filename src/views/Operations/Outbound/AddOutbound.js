import { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
  makeStyles,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Box
} from '@material-ui/core'
import { isRequired, isNotEmptyArray } from '../../../utils/validators';
import { Alert, Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import { dateFormatWithoutTime, dateToPickerFormat, getURL } from '../../../utils/common';
import { TableBody } from '@material-ui/core';
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

export default function AddProductOutwardView({ }) {
  const classes = useStyles();
  const { state } = useLocation();
  const navigate = useNavigate();

  const 
  [selectedProductOutward, setSelectedProductOutward] = useState(state ? state.selectedProductOutward : null),
  [validation, setValidation] = useState({}),
  [shipmentDate, setShipmentDate] = useState(0),
  [receiverName, setReceiverName] = useState(''),
  [receiverPhone, setReceiverPhone] = useState(''),
  [warehouse, setWarehouse] = useState(''),
  [customer, setCustomer] = useState(''),
  [dispatchOrderId, setDispatchOrderId] = useState(''),
  [referenceId, setReferenceId] = useState(''),
  [vehicleId, setVehicleId] = useState(''),
  [internalIdForBusiness, setInternalIdForBusiness] = useState(''),
  [formErrors, setFormErrors] = useState([]),
  [dispatchOrders, setDispatchOrders] = useState([]),
  [inventoryQuantities, setInventoryQuantities] = useState([]),
  [vehicles, setVehicles] = useState([]), // will be used instead vehicle types, numbers etc
  [selectedDispatchOrder, setSelectedDispatchOrder] = useState(null), // used in details table, selected from dropdown
  [showMessage, setShowMessage] = useState(null);

  useEffect(() => {
    getRelations();
  }, []);


  const getRelations = () => {
    axios.get(getURL('/inward/relations'))
      .then(res => {
        setVehicles(res.data.relations.vehicles ? res.data.relations.vehicles : []);
        setDispatchOrders(res.data.relations.dispatchOrders ? res.data.relations.dispatchOrders : []);
      });
  };

  useEffect(() => {
    if (!!selectedProductOutward) {
      selectDispatchOrder(selectedProductOutward.dispatchOrderId || '', selectedProductOutward.internalIdForBusiness || '');
    } else {
      setValidation({})
      selectDispatchOrder('');
    }
  }, [selectedProductOutward, dispatchOrders])

  const dispatchOrdersForDropdown = []
  const filterDispatchOrdersForDropdown = () => {
    dispatchOrders.forEach(dispatchOrder => {
      let totalRequestedQuantity = dispatchOrder.Inventories.reduce((acc, inv) => acc + inv.OrderGroup.quantity, 0); // 1 DO
      let totalDispatchedQuantity = 0;
      dispatchOrder.ProductOutwards.forEach(po => {
        totalDispatchedQuantity += po.Inventories.reduce((acc, inv) => acc + inv.OutwardGroup.quantity, 0)
      });
      let remainingQuantityOfDispatch = totalRequestedQuantity - totalDispatchedQuantity // 1 DO's remaining quantity

      if (remainingQuantityOfDispatch != 0) {
        dispatchOrdersForDropdown.push(dispatchOrder);
      }
    });
  }
  filterDispatchOrdersForDropdown();

  // resolved: error occurs on product outward edit.
  const selectDispatchOrder = (value, internalIdForBusiness) => {
    setDispatchOrderId(value);
    if (value && dispatchOrders.length > 0) {
      let dispatchOrder = dispatchOrders.find(dispatchOrder => dispatchOrder.id == value);
      setSelectedDispatchOrder(dispatchOrder)
      console.log(dispatchOrder)
      console.log("cndndnvdnv", selectedDispatchOrder)
      setWarehouse(dispatchOrder.Inventory.Warehouse.name);
      setCustomer(dispatchOrder.Inventory.Company.name);
      setShipmentDate(dispatchOrder.shipmentDate || '');
      setReceiverName(dispatchOrder.receiverName || '');
      setReceiverPhone(dispatchOrder.receiverPhone || '');
      setReferenceId(dispatchOrder.referenceId || '')
      setInternalIdForBusiness(`${dispatchOrder.internalIdForBusiness}`)
      if (selectedProductOutward) {
        setVehicleId(selectedProductOutward.vehicleId || '')
      }
    }
    else {
      setWarehouse('');
      setCustomer('');
      setShipmentDate('');
      setReceiverName('');
      setReceiverPhone('');
      setReferenceId('');
      setInternalIdForBusiness('');
      setVehicleId('');
    }
  }

  const addProductOutward = data => {
    let apiPromise = null;
    if (!selectedProductOutward) apiPromise = axios.post(getURL('/outward'), data);
    else apiPromise = axios.put(getURL(`product-outward/${selectedProductOutward.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
        return
      }
      setShowMessage({
        message: "New product outward has been created."
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
    const newProductOutward = {
      dispatchOrderId,
      referenceId,
      vehicleId,
      inventories: Object.values(inventoryQuantities),
      internalIdForBusiness
    }
    setValidation({
      dispatchOrderId: true,
      vehicleId: true
    });
    if (isRequired(dispatchOrderId)
      && isRequired(vehicleId)
      && isNotEmptyArray(Object.values(inventoryQuantities))) {
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
              id="combo-box-demo"
              options={dispatchOrders}
              getOptionLabel={(dispatchOrder) => dispatchOrder.internalIdForBusiness || ''}
              onChange={(event, newValue) => {
                if (newValue)
                  selectDispatchOrder(newValue.id, (newValue.internalIdForBusiness || ''))
              }}
              renderInput={(params) => <TextField {...params} label="Dispatch Order Id" variant="outlined" />}
            />
            {validation.dispatchOrderId && !isRequired(dispatchOrderId) ? <Typography color="error">Dispatch order Id is required!</Typography> : ''}
          </FormControl>
        </Grid>
        <Grid item sm={12}>
          <FormControl margin="dense" fullWidth={true} variant="outlined">
            <InputLabel>Vehicle</InputLabel>
            <Select
              fullWidth={true}
              displayEmpty
              id="vehicle"
              label="Vehicle Number"
              variant="outlined"
              value={vehicleId}
              onChange={e => setVehicleId(e.target.value)}
              onBlur={e => setValidation({ ...validation, vehicleId: true })}
            >
              {
                vehicleId == '' ?
                  <MenuItem value=""></MenuItem>
                  :
                  <MenuItem value={vehicleId} disable> {vehicleId} </MenuItem>
              }
              {vehicles.map((vehicle, index) => <MenuItem key={index} value={vehicle.id}>{vehicle.registrationNumber}</MenuItem>)}
            </Select>
            {validation.vehicleId && !isRequired(vehicleId) ? <Typography color="error">Vehicle number is required!</Typography> : ''}
          </FormControl>
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
            disabled
            inputProps={{ maxLength: 30 }}
            onChange={(e) => { setReferenceId(e.target.value) }}
          />
        </Grid>
     
        {
        selectedDispatchOrder ?
          <TableContainer className={classes.parentContainer}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Customer
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Warehouse
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Outwards
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Shipment Date
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Receiver Name
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Receiver Phone
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover role="checkbox">
                  <TableCell>
                    {customer}
                  </TableCell>
                  <TableCell>
                    {warehouse}
                  </TableCell>
                  <TableCell>
                    {selectedDispatchOrder.ProductOutwards.length}
                  </TableCell>
                  <TableCell>
                    {dateFormatWithoutTime(shipmentDate)}
                  </TableCell>
                  <TableCell>
                    {receiverName}
                  </TableCell>
                  <TableCell>
                    {receiverPhone}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          :
          ''
      }
      {
        selectedDispatchOrder ?
          <>
            <Grid container className={classes.parentContainer} spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h3" className={classes.heading}>Product Details</Typography>
              </Grid>
            </Grid>
            <TableContainer className={classes.parentContainer}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      Product
                    </TableCell>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      UOM
                    </TableCell>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      Ordered Quantity
                    </TableCell>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      Available Quantity
                    </TableCell>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      Actual Quantity To Dispatch
                    </TableCell>
                  </TableRow>
                </TableHead>
                {selectedDispatchOrder.Inventories.map((inventory, idx) => {
                  let remainingQt = 0
                  selectedDispatchOrder.ProductOutwards.forEach((po) => {
                    const targetedPoInv = po.Inventories.find((inv) => inv.OutwardGroup.inventoryId === inventory.OrderGroup.inventoryId)
                    remainingQt += targetedPoInv.OutwardGroup.quantity
                  })
                  remainingQt = inventory.OrderGroup.quantity - remainingQt
                  return <>
                    <TableRow hover role="checkbox" key={idx}>
                      <TableCell>
                        {inventory.Product.name}
                      </TableCell>
                      <TableCell>
                        {inventory.Product.UOM.name}
                      </TableCell>
                      <TableCell>
                        {inventory.totalInwardQuantity}
                      </TableCell>
                      <TableCell>
                         {inventory.availableQuantity}
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth={true}
                          margin="dense"
                          InputProps={{ inputProps: { min: 0, max: inventory.availableQuantity } }}
                          id="quantity"
                          label="Quantity"
                          type="number"
                          variant="outlined"
                          onChange={e => setInventoryQuantities({ ...inventoryQuantities, [idx]: { quantity: e.target.value < remainingQt ? e.target.value : remainingQt, id: inventory.id } })} // TODO: Fix multi inputs
                          onBlur={e => setValidation({ ...validation, quantity: true })}
                        />
                       
                      </TableCell>
                    </TableRow>
                  </>
                })}
              </Table>
            </TableContainer>
            <Grid container className={classes.parentContainer} spacing={3}>
              <Grid item xs={3}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <Button onClick={handleSubmit} color="primary" variant="contained">
                    {!selectedProductOutward ? 'Save' : 'Update'}
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </>
          :
          ''
      }
     <MessageSnackbar showMessage={showMessage}  />
</TableContainer>
</Grid>
</Grid>
      
    </>
  );
}

