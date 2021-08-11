import { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  TextField,
  FormControl,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
  Box
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import { Alert } from '@material-ui/lab';
import { isRequired } from '../../../utils/validators';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import { checkForMatchInArray, getURL } from '../../../utils/common';
import MessageSnackbar from '../../../components/MessageSnackBar';
import { useLocation, useNavigate } from 'react-router';

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
export default function AddProductInwardView() {
  const classes = useStyles();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { viewOnly } = state || '';
  const 
  [selectedProductInward, setSelectedProductInward] = useState(state ? state.selectedProductInward : null),
  [validation, setValidation] = useState({}),
  [warehouseId, setWarehouseId] = useState(''),
  [referenceId, setReferenceId] = useState(''),
  [productId, setProductId] = useState(''),
  [quantity, setQuantity] = useState(0),
  [productGroups, setProductGroups] = useState([]),
  [products, setProducts] = useState([]),
  [warehouses, setWarehouses] = useState([]),
  [formErrors, setFormErrors] = useState([]),
  [internalIdForBusiness, setInternalIdForBusiness] = useState(''),
  [showMessage, setShowMessage] = useState(null),
  [messageType, setMessageType] = useState(null);

  useEffect(() => {
    getRelations();
  }, []);

  const getRelations = () => {
    axios.get(getURL('/inward/relations'))
      .then(res => {
        setProducts(res.data.relations.products ? res.data.relations.products : [])
        setWarehouses(res.data.relations.warehouses ? res.data.relations.warehouses : [])
      });
  };
  const selectProduct = value => {
    setProductId(value);
  }

  useEffect(() => {
    if (!!selectedProductInward) {
      setQuantity(0);
      selectProduct('');
      setWarehouseId(selectedProductInward.Warehouse.id || '');
      setReferenceId(selectedProductInward.referenceId || '');
      if (products.length > 0 && productGroups.length == 0) {
        productGroups.forEach(product => {
          //correct way of updating states.
          setProductGroups((prevState) => ([
            ...prevState,
            {
              product: products.find(_product => _product.id == product.id),
              id: productId,
              quantity: quantity
            }
          ]))
        });
      }
    } else {
      setQuantity('');
      selectProduct('');
      setWarehouseId('');
    }
  }, [selectedProductInward, products, warehouses]);

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
        warehouseId: true
      });
    }
  }

  const addProductInward = data => {
    let apiPromise = null;
    if (!selectedProductInward) apiPromise = axios.post(getURL('/inward'), data);
    else apiPromise = axios.put(getURL(`product-inward/${selectedProductInward.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
        return
      }
      setShowMessage({
        message: "New products inward have been created."
      });
      setTimeout(() => {
        navigate('/operation-transactions/inwards')
      }, 2000);
    })
      .catch((err) => {
        console.log(err)
      });
  };

  const handleSubmit = e => {
    setMessageType('green')
    const newProductInward = {
      customerId : parseInt(localStorage.getItem("currentUser")),
      productId,
      quantity,
      warehouseId,
      referenceId,
      products: Object.values(productGroups),
      internalIdForBusiness,
      totalInwardQuantity : 0
    }

    setValidation({
      quantity: true,
      productId: true,
      warehouseId: true
    });
    if (isRequired(quantity) &&
      isRequired(productId) &&
      isRequired(warehouseId)) {
      addProductInward(newProductInward);
    }
  }

  return (
    <>
      {formErrors}
   
      <Grid container spacing={3} className={classes.parentContainer}>
<Grid item xs={12}>
<Typography variant="h3">
<Box className={classes.heading}>Add Inward</Box>
</Typography>
</Grid>
<Grid item xs={12}>
<TableContainer className={classes.tableContainer}>

<Grid item sm={12}>
  <FormControl margin="dense" fullWidth={true} variant="outlined">
    <Autocomplete
      id="warehouse"
      defaultValue={selectedProductInward ? { name: selectedProductInward.Warehouse.name, id: selectedProductInward.Warehouse.id } : ''}
      options={warehouses}
      getOptionLabel={(warehouse) => warehouse.name}
      onChange={(event, newValue) => {
        if (newValue) {
          setWarehouseId(newValue.id);
          setInternalIdForBusiness(`PI-${newValue.businessWarehouseCode}-`);
        }
      }}
      renderInput={(params) => <TextField {...params} label="Warehouse" variant="outlined" />}
      onBlur={e => setValidation({ ...validation, warehouseId: true })}
    />
    {validation.warehouseId && !isRequired(warehouseId) ? <Typography color="error">Warehouse is required!</Typography> : ''}
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
    disabled={viewOnly}
    onChange={e => setReferenceId(e.target.value)}
    inputProps={{ maxLength: 30 }}
    onBlur={e => setValidation({ ...validation, referenceId: true })}
  />
  {validation.referenceId && !isRequired(referenceId) ? <Typography color="error">ReferenceId is required!</Typography> : ''}
</Grid>

<Grid item xs={12}>
  <Typography style ={{marginTop : "20px"}}  variant="h4" className={classes.heading}>Product Details</Typography>
</Grid>
<Grid container alignItems="center" spacing={2}>
  <Grid item xs={6}>
    <FormControl margin="dense" fullWidth={true} variant="outlined">
      <Autocomplete
        id="Product"
        options={products}
        getOptionLabel={(product) => product.name}
        onChange={(event, newValue) => {
          if (newValue)
            selectProduct(newValue.id)
            setProductId(newValue.id)
        }}
        renderInput={(params) => <TextField {...params} label="Product" variant="outlined" />}
        onBlur={e => setValidation({ ...validation, productId: true })}
      />
      {validation.productId && !isRequired(productId) ? <Typography color="error">Product is required!</Typography> : ''}
    </FormControl>
  </Grid>
  <Grid item xs={2}>
    <TextField
      fullWidth={true}
      margin="dense"
      id="quantity"
      label="Quantity"
      type="number"
      variant="outlined"
      value={quantity}
      disabled={viewOnly}
      onChange={e => setQuantity(e.target.value)}
      onBlur={e => setValidation({ ...validation, quantity: true })}
    />
    {validation.quantity && !isRequired(quantity) ? <Typography color="error">Quantity is required!</Typography> : ''}
  </Grid>
  <Grid item xs={2} className={classes.parentContainer}>
    <FormControl margin="dense" fullWidth={true} variant="outlined">
      <Button variant="contained" onClick={updateProductsTable} color="primary" variant="contained">Add Product</Button>
    </FormControl>
  </Grid>
</Grid>



<TableContainer className={classes.parentContainer}>
<Table stickyHeader aria-label="sticky table">
  <TableHead>
    <TableRow className={classes.shadedTableHeader}>
      <TableCell
        className={classes.tableHeadText}>
        Name
      </TableCell>
      <TableCell
        className={classes.tableHeadText}>
        Quantity
      </TableCell>
      <TableCell>
        Actions
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {productGroups.map((productGroup, idx) => {
      return (
        <TableRow hover role="checkbox">
          <TableCell>
            {productGroup.product.name}
          </TableCell>
          <TableCell>
            {productGroup.quantity}
          </TableCell>
          <TableCell>
            <DeleteIcon color="error" key="delete" onClick={() =>
              setProductGroups(productGroups.filter((_productGroup, _idx) => _idx != idx))
            } />
          </TableCell>
        </TableRow>
      )
    })}
  </TableBody>
</Table>
</TableContainer>

{
productGroups.length > 0 ?
  <Grid container className={classes.parentContainer} xs={12} spacing={3}>
    <Grid item xs={3}>
      <FormControl margin="dense" fullWidth={true} variant="outlined">
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {!selectedProductInward ? 'Save' : 'Update'}
        </Button>
      </FormControl>
    </Grid>
  </Grid>
  :
  ''}

     <MessageSnackbar showMessage={showMessage}  />
</TableContainer>
</Grid>
</Grid>
     
    </>
  );
}
