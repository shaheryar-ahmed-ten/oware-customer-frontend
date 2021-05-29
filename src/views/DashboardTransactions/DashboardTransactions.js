import React, { useEffect, useState } from 'react'
import { Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import axios from 'axios';
import { getURL } from '../../utils/common';
const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function DashboardTransactions() {
  const classes = useStyles();
  const [inboundStats, setInboundStats] = useState(null)
  const [outboundStats, setOutboundStats] = useState(null)
  const [generalStats, setGeneralStats] = useState(null)
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
      <h1>INBOUND TRANSACTION</h1>
      <Grid container>
        <Grid item xs={4}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography className={classes.title} gutterBottom>Total Inward Transactions - last 7 days</Typography>
              <Typography className={classes.title} gutterBottom>
                {inboundStats ? inboundStats.total : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography className={classes.title} gutterBottom>Total Inward in Kgs - last 7 days</Typography>
              <Typography className={classes.title} gutterBottom>
                {inboundStats ? inboundStats.weight : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography className={classes.title} gutterBottom>Total Inward in cm3 - last 7 days</Typography>
              <Typography className={classes.title} gutterBottom>
                {inboundStats ? inboundStats.dimensionsCBM : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <h1>OUTBOUND TRANSACTION</h1>
      <Grid container>
        <Grid item xs={4}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography className={classes.title} gutterBottom>Total Outward Transactions - last 7 days</Typography>
              <Typography className={classes.title} gutterBottom>
                {outboundStats ? outboundStats.total : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography className={classes.title} gutterBottom>Total Outward in Kgs - last 7 days</Typography>
              <Typography className={classes.title} gutterBottom>
                {outboundStats ? outboundStats.weight : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography className={classes.title} gutterBottom>Total Outward in cm3 - last 7 days</Typography>
              <Typography className={classes.title} gutterBottom>
                {outboundStats ? outboundStats.dimensionsCBM : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <h1>STATISTICAL DATA</h1>
      <Grid container>
        <Grid item xs={4}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography className={classes.title} gutterBottom>Pending Orders</Typography>
              <Typography className={classes.title} gutterBottom>
                {generalStats ? generalStats.pendingOrders : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography className={classes.title} gutterBottom>Products Stored</Typography>
              <Typography className={classes.title} gutterBottom>
                {generalStats ? generalStats.products : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography className={classes.title} gutterBottom>Warehouses Used</Typography>
              <Typography className={classes.title} gutterBottom>
                {generalStats ? generalStats.warehouses : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </>
  )
}

export default DashboardTransactions
