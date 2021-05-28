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
    const [inboundStatisticalData, setInboundStatisticalData] = useState(null)
    const [generalStatisticsData, setGeneralStatisticsData] = useState(null)
    useEffect(() => {
        axios.get(getURL(`/product-inward/dashboard`))
            .then((response) => {
                console.log(response.data.productAndWarehouseDetails[0])
                setInboundStatisticalData((prevState) => response.data.inboundStats)
                setGeneralStatisticsData((prevState) => response.data.productAndWarehouseDetails[0])
            })
    }, []);
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        <Box fontWeight="fontWeightBold">
                            Overview
                        </Box>
                    </Typography>
                </Grid>
                <Grid container item={12} spacing={3}>
                    <Grid item xs={4}>
                        <PrimaryWidget name="Pending Orders" value={0} />
                    </Grid>
                    <Grid item xs={4}>
                        <PrimaryWidget name="Products Stored" value={generalStatisticsData ? generalStatisticsData.productsStored : 0} />
                    </Grid>
                    <Grid item xs={4}>
                        <PrimaryWidget name="Warehouse Used" value={generalStatisticsData ? generalStatisticsData.warehousesUsed : 0} />
                    </Grid>
                </Grid>
                <Grid item xs={12} className={classes.activityGrid}>
                    <Typography variant="h4">Last 7 days Activity</Typography>
                </Grid>
                <Grid container item={12} spacing={3}>
                    <Grid item xs={6}>
                        <SecondaryWidget icon={<ArrowDownwardOutlinedIcon className={classes.successIcon} />} name="Inwards" value={inboundStatisticalData ? inboundStatisticalData.count[0].count : 0} type="Transactions" totalQuantity={inboundStatisticalData ? inboundStatisticalData.rows[0].Product.totalWeightInKGs : 0} totalVolume={inboundStatisticalData ? inboundStatisticalData.rows[0].Product.totalInCm3 : 0} />
                    </Grid>
                    <Grid item xs={6}>
                        <SecondaryWidget icon={<ArrowUpwardOutlinedIcon className={classes.errorIcon} />} name="Outwards" value={55} type="Transactions" totalQuantity={"450"} totalVolume={"11"} />
                    </Grid>
                </Grid>
                {/* <h1>INBOUND TRANSACTION</h1>
                <Grid container>
                    <Grid item xs={4}>
                        <Card className={classes.root} variant="outlined">
                            <CardContent>
                                <Typography className={classes.title} gutterBottom>
                                    Total Inward Transactions - last 7 days
                    </Typography>
                                <Typography className={classes.title} gutterBottom>
                                    {inboundStatisticalData ? inboundStatisticalData.count[0].count : 0}
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
                                    {inboundStatisticalData ? inboundStatisticalData.rows[0].Product.totalWeightInKGs : 0}
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
                                    {inboundStatisticalData ? inboundStatisticalData.rows[0].Product.totalInCm3 : 0}
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
                                    Total Outward Transactions - last 7 days
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
             */}
            </Grid>

        </>
    )
}

export default DashboardTransactions
