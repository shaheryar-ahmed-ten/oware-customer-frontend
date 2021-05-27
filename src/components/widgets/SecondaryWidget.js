import { Card, Divider, makeStyles, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles({
    root: {
        border: "1px dotted black",
        height: 200,
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
        boxSizing: "border-box",
        padding: "10px 10px"
    },
    title: {
        fontSize: 14,
    },
    details: {
        display: "flex",
        justifyContent: "space-between"
    }
})
function SecondaryWidget({ icon, name, value, totalQuantity, totalVolume, type }) {
    const classes = useStyles()
    return (
        <>
            <Card className={classes.root}>
                <Typography className={classes.title} gutterBottom>
                    {name}
                </Typography>
                <Typography variant="h1" component="h2">
                    {value}
                </Typography>
                <Typography variant="h5" component="h2">
                    {type}
                </Typography>
                <Divider />
                <div className={classes.details}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Total Quantity
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom>
                        {totalQuantity}
                    </Typography>
                </div>
                <div className={classes.details}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Total Volume
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom>
                        {totalVolume}
                    </Typography>
                </div>

            </Card>
        </>
    )
}

export default SecondaryWidget
