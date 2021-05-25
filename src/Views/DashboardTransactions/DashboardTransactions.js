import React, { useEffect } from 'react'
import { Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import axios from 'axios';
import { getURL } from '../../Utils/common';
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
    useEffect(() => {
        axios.get(getURL(`/product-inward/dashboard`))
        .then((response)=>{
            console.log(response.data)
        })
    }, [])
    return (
        <>
            <h1>INBOUND TRANSACTION</h1>
            <Grid container>
                <Grid item xs={4}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Total Inward - last 7 days
                    </Typography>
                            <Typography className={classes.title} gutterBottom>
                                0
                    </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Total Inward in Kgs - last 7 days
                    </Typography>
                            <Typography className={classes.title} gutterBottom>
                                0
                    </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Total Inward in cm3 - last 7 days
                    </Typography>
                            <Typography className={classes.title} gutterBottom>
                                0
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
                            <Typography className={classes.title} gutterBottom>
                                Total Outward - last 7 days
                    </Typography>
                            <Typography className={classes.title} gutterBottom>
                                0
                    </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Total Outward in Kgs - last 7 days
                    </Typography>
                            <Typography className={classes.title} gutterBottom>
                                0
                    </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Total Outward in cm3 - last 7 days
                    </Typography>
                            <Typography className={classes.title} gutterBottom>
                                0
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
                            <Typography className={classes.title} gutterBottom>
                                Pending Orders
                    </Typography>
                            <Typography className={classes.title} gutterBottom>
                                0
                    </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Products Stored
                    </Typography>
                            <Typography className={classes.title} gutterBottom>
                                0
                    </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Warehouses Used
                    </Typography>
                            <Typography className={classes.title} gutterBottom>
                                0
                    </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </>
    )
}

export default DashboardTransactions
