import React, { useEffect, useState } from 'react'
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import axios from 'axios';
import { getURL } from '../../utils/common';
import PrimaryWidget from '../../components/widgets/PrimaryWidget';
import SecondaryWidget from '../../components/widgets/SecondaryWidget';
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';
const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: "600"
  },
  pos: {
    marginBottom: 12,
  },
  successIcon: {
    color: 'green',
  },
  errorIcon: {
    color: 'red',
  },
  activityGrid: {
    marginTop: '47px'
  },
  gridContainer: {
    boxSizing: 'border-box',
    [theme.breakpoints.up('lg')]: {
      paddingRight: 30,
      paddingTop: 30,
      paddingBottom: 30
    },
  }
}));

function DashboardTransactions() {
  const classes = useStyles();
  const [inboundStats, setInboundStats] = useState(null);
  const [outboundStats, setOutboundStats] = useState(null);
  const [generalStats, setGeneralStats] = useState(null);
  useEffect(() => {
    axios.get(getURL(`/dashboard`))
      .then((response) => {
        setInboundStats(response.data.inboundStats);
        setOutboundStats(response.data.outboundStats);
        setGeneralStats(response.data.generalStats);
      })
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
          <Grid item xs={4}>
            <PrimaryWidget name="Pending Orders" value={generalStats ? generalStats.pendingOrders : 0} />
          </Grid>
          <Grid item xs={4}>
            <PrimaryWidget name="Products Stored" value={generalStats ? generalStats.products : 0} />
          </Grid>
          <Grid item xs={4}>
            <PrimaryWidget name="Warehouse Used" value={generalStats ? generalStats.warehouses : 0} />
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.activityGrid}>
          <Typography variant="h4">Last 7 days Activity</Typography>
        </Grid>
        <Grid container spacing={2} item={12} justify="space-between">
          <Grid item xs={6}>
            <SecondaryWidget icon={<ArrowDownwardOutlinedIcon className={classes.successIcon} />} name="Inwards" value={(inboundStats && inboundStats.total)? inboundStats.total : 0} type="Transactions" totalQuantity={(inboundStats && inboundStats.weight)? inboundStats.weight : 0} totalVolume={(inboundStats && inboundStats.dimensionsCBM)? inboundStats.dimensionsCBM : 0} />
          </Grid>
          <Grid item xs={6}>
            <SecondaryWidget icon={<ArrowUpwardOutlinedIcon className={classes.errorIcon} />} name="Outwards" value={(outboundStats && outboundStats.total)? outboundStats.total : 0} type="Transactions" totalQuantity={(outboundStats && outboundStats.weight)? outboundStats.weight : 0} totalVolume={(outboundStats && outboundStats.dimensionsCBM)? outboundStats.dimensionsCBM : 0} />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default DashboardTransactions
