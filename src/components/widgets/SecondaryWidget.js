import { Card, Divider, makeStyles, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles({
    root: {
        height: 227,
        width: "100%",
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
        boxSizing: "border-box",
        padding: "19px 19px",
        backgroundColor: "#FFFFFF",
        borderRadius: "4px",
        border: "1px solid #F0F0F0",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)"
    },
    title: {
        fontSize: 18,
        display: "flex",
        lineHeight: "22px",
        alignItems: "center",
        fontWeight: "600"
    },
    details: {
        display: "flex",
        justifyContent: "space-between"
    },
    detailsHead: {
        fontWeight: 400,
        fontSize: 16,
        lineHeight: "19.36px"
    },
    detailsValue: {
        fontWeight: 600,
        fontSize: 16,
        lineHeight: "19px",
    },
    value: {
        fontWeight: 700,
        fontSize: 50,
        lineHeight: "61px",
        display: "flex",
        alignItems: "center"
    },
    type: {
        fontWeight: 600,
        fontSize: 16,
        lineHeight: "19px",
        boxSizing: "border-box",
        paddingLeft: "10px"
    }
})
function SecondaryWidget({ icon, name, value, totalQuantity, totalVolume, type }) {
    const classes = useStyles()
    return (
        <>
            <Card className={classes.root}>
                <Typography className={classes.title} gutterBottom>
                    {icon}
                    {name}
                </Typography>
                <Typography className={classes.value}>
                    {value}
                    <span className={classes.type}>
                        {type}
                    </span>
                </Typography>

                <br />
                <Divider />
                <br />
                <div className={classes.details}>
                    <Typography className={classes.detailsHead} gutterBottom>
                        Total Weight
                    </Typography>
                    <Typography className={classes.detailsValue} gutterBottom>
                        {Math.round(totalQuantity).toLocaleString()} kgs
                    </Typography>
                </div>
                <br />
                <div className={classes.details}>
                    <Typography className={classes.detailsHead} gutterBottom>
                        Total Volume
                    </Typography>
                    <Typography className={classes.detailsValue} gutterBottom>
                        {Math.round(totalVolume).toLocaleString()} cm3
                    </Typography>
                </div>

            </Card>
        </>
    )
}

export default SecondaryWidget
