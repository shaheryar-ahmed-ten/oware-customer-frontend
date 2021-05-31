import React, { useEffect, useState } from 'react'
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import axios from 'axios';
import { getURL } from '../../utils/common';
import PrimaryWidget from '../../components/widgets/PrimaryWidget';
import SecondaryWidget from '../../components/widgets/SecondaryWidget';
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';
const useStyles = makeStyles({
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
    }
});

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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h3">
              <Box fontWeight="fontWeightBold">Overview</Box>
            </Typography>
          </Grid>
          <Grid container item={12} spacing={3}>
            <Grid item xs={4}>
              <PrimaryWidget name="Pending Orders" value={0} />
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
          <Grid container item={12} spacing={3}>
            <Grid item xs={6}>
              <SecondaryWidget icon={<ArrowDownwardOutlinedIcon className={classes.successIcon} />} name="Inwards" value={inboundStats ? inboundStats.total : 0} type="Transactions" totalQuantity={inboundStats ? inboundStats.weight : 0} totalVolume={inboundStats ? inboundStats.dimensionsCBM : 0} />
            </Grid>
            <Grid item xs={6}>
              <SecondaryWidget icon={<ArrowUpwardOutlinedIcon className={classes.errorIcon} />} name="Outwards" value={outboundStats ? outboundStats.total : 0} type="Transactions" totalQuantity={outboundStats ? outboundStats.weight : 0} totalVolume={outboundStats ? outboundStats.dimensionsCBM : 0} />
            </Grid>
          </Grid>
        </Grid>

      </>
  )
}

export default DashboardTransactions
