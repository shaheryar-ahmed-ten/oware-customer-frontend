// import React, { useEffect, useState } from 'react'
// import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
// import axios from 'axios';
// import { getURL } from '../../utils/common';
import PrimaryWidget from "../../components/widgets/PrimaryWidget";
import SecondaryWidget from "../../components/widgets/SecondaryWidget";
import SecondaryRideWidget from "../../components/widgets/SecondaryRideWidget";
import ArrowDownwardOutlinedIcon from "@material-ui/icons/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@material-ui/icons/ArrowUpwardOutlined";
import DirectionCar from "@material-ui/icons/DirectionsCar.js";
import { useNavigate } from "react-router";
import {
  Box,
  Divider,
  Grid,
  InputAdornment,
  InputBase,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from "@material-ui/core";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { dateFormat, getURL } from "../../utils/common";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import TableHeader from "../../components/TableHeader";
import { Pagination } from "@material-ui/lab";
import { debounce } from "lodash";
import { DEBOUNCE_TIME } from "../../config";
// import LogisticDetails from "./LogisticDetails";
import clsx from "clsx";
const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: "600",
  },
  pos: {
    marginBottom: 12,
  },
  successIcon: {
    color: "#85C830",
  },
  errorIcon: {
    color: "red",
  },
  carIcon: {
    color: "#000000",
  },
  activityGrid: {
    marginTop: "47px",
  },
  rideActivityGrid: {
    marginTop: "8px",
  },
  gridContainer: {
    boxSizing: "border-box",
    [theme.breakpoints.up("lg")]: {
      paddingRight: 30,
      paddingTop: 30,
      paddingBottom: 30,
    },
  },
  externalHeader: {
    marginTop: "37px",
    display: "flex",
    justifyContent: "space-between",
  },
}));

function DashboardTransactions() {
  const classes = useStyles();
  const columns = [
    {
      id: "id",
      label: "RIDE ID",
      minWidth: "auto",
      className: classes.productNameStyle,
      format: (value, entity) => entity.id,
    },
    {
      id: "price",
      label: "PRICE",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: (value, entity) => `RS. ${entity.price ? entity.price : "-"}`,
    },
    {
      id: "pickupDate",
      label: "PICKUP DATE/TIME",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: dateFormat,
    },
    {
      id: "pickupCity.name",
      label: "PICKUP CITY",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: (value, entity) => (entity.pickupCity ? entity.pickupCity.name : null),
    },
    // {
    //   id: "pickupAddress",
    //   label: "PICKUP ADDRESS",
    //   minWidth: "auto",
    //   className: classes.orderIdStyle,
    //   format: (value, entity) => entity.pickupAddress,
    // },
    {
      id: "dropoffCity.name",
      label: "DROPOFF CITY",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: (value, entity) => (entity.dropoffCity ? entity.dropoffCity.name : null),
    },
    {
      id: "dropoffDate",
      label: "DROPOFF DATE/TIME",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: dateFormat,
    },
    {
      id: "status",
      label: "STATUS",
      minWidth: "auto",
      className: classes.orderIdStyle,
      format: (value, entity) =>
        entity.status === "ASSIGNED" ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.fullfilledStatusButtonStyling)}>
            ASSIGNED
          </Button>
        ) : entity.status === "PENDING" ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.pendingStatusButtonStyling)}>
            PENDING
          </Button>
        ) : entity.status === "UNASSIGNED" ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            UNASSIGNED
          </Button>
        ) : entity.status === "INPROGRESS" ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            IN-PROGRESS
          </Button>
        ) : entity.status === "COMPLETED" ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.completedStatusButtonStyling)}>
            COMPLETED
          </Button>
        ) : entity.status === "CANCELLED" ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            CANCELLED
          </Button>
        ) : (
          ""
        ),
    },
  ];

  const [inboundStats, setInboundStats] = useState(null);
  const [outboundStats, setOutboundStats] = useState(null);
  const [rideStats, setRideStats] = useState(null);
  const [generalStats, setGeneralStats] = useState(null);
  const [logistics, setLogistics] = useState([]);
  const [logisticDetailsViewOpen, setLogisticDetailsViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const openViewDetails = (logistic) => {
    setSelectedProduct(logistic);
    setLogisticDetailsViewOpen(true);
  };
  const closeLogisticDetailsView = () => {
    setLogisticDetailsViewOpen(false);
    setSelectedProduct(null);
  };
  useEffect(() => {
    getLogistics();
  }, []);
  const _getLogistics = () => {
    axios
      .get(getURL(`/dashboard/ride`), {
        params: {},
      })
      .then((res) => {
        setLogistics(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getLogistics = useCallback(
    debounce(() => {
      _getLogistics();
    }, DEBOUNCE_TIME),
    []
  );
  const redirectToRide = () => {
    navigate("/logistics");
  };

  useEffect(() => {
    axios.get(getURL(`/dashboard`)).then((response) => {
      setInboundStats(response.data.inboundStats);
      setOutboundStats(response.data.outboundStats);
      setGeneralStats(response.data.generalStats);
      setRideStats(response.data.rideStats);
    });
  }, []);
  return (
    <>
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item xs={12}>
          <Typography variant="h3">
            <Box className={classes.heading}>Overview</Box>
          </Typography>
        </Grid>
        <Grid container item={12} spacing={3}>
          <Grid item xs={3}>
            <PrimaryWidget name="Pending Orders" value={generalStats ? generalStats.pendingOrders : 0} />
          </Grid>
          <Grid item xs={3}>
            <PrimaryWidget name="Products Stored" value={generalStats ? generalStats.products : 0} />
          </Grid>
          <Grid item xs={3}>
            <PrimaryWidget name="Warehouse Used" value={generalStats ? generalStats.warehouses : 0} />
          </Grid>
          {/* <Grid item xs={2}>
            <PrimaryWidget name="Pending Rides" value={generalStats ? generalStats.rides : 0} />
          </Grid> */}
          <Grid item xs={3}>
            <PrimaryWidget name="Completed Loads" value={generalStats ? generalStats.completedRides : 0} />
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.activityGrid}>
          <Typography variant="h4">Last 7 days Activity</Typography>
        </Grid>
        <Grid container spacing={2} item={12} justify="space-between">
          <Grid item xs={6}>
            <SecondaryWidget
              icon={<ArrowDownwardOutlinedIcon className={classes.successIcon} />}
              name="Inwards"
              value={inboundStats && inboundStats.total ? inboundStats.total : 0}
              type="Transactions"
              totalQuantity={inboundStats && inboundStats.weight ? inboundStats.weight : 0}
              totalVolume={inboundStats && inboundStats.dimensionsCBM ? inboundStats.dimensionsCBM : 0}
            />
          </Grid>
          <Grid item xs={6}>
            <SecondaryWidget
              icon={<ArrowUpwardOutlinedIcon className={classes.errorIcon} />}
              name="Outwards"
              value={outboundStats && outboundStats.total ? outboundStats.total : 0}
              type="Transactions"
              totalQuantity={outboundStats && outboundStats.weight ? outboundStats.weight : 0}
              totalVolume={outboundStats && outboundStats.dimensionsCBM ? outboundStats.dimensionsCBM : 0}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} item={12} justify="space-between" className={classes.rideActivityGrid}>
          <Grid item xs={12}>
            <SecondaryRideWidget
              icon={<DirectionCar className={classes.carIcon} />}
              name="Loads"
              value={rideStats && rideStats.total ? rideStats.total : 0}
              type="Loads Created"
              totalUnassigned={rideStats && rideStats.unassigned ? rideStats.unassigned : 0}
              totalAssigned={rideStats && rideStats.assigned ? rideStats.assigned : 0}
              totalInprogress={rideStats && rideStats.inprogress ? rideStats.inprogress : 0}
              totalCancelled={rideStats && rideStats.cancelled ? rideStats.cancelled : 0}
              totalCompleted={rideStats && rideStats.completed ? rideStats.completed : 0}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default DashboardTransactions;
