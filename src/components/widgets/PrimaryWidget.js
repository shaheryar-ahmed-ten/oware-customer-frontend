import { Card, makeStyles, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles({
    root: {
        border: "1px solid #F0F0F0",
        boxSizing: "border-box",
        padding: "19px 19px",
        height: 116,
        backgroundColor: "#FFFFFF",
        borderRadius: "4px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)"
    },
    title: {
        fontSize: 16,
        fontWeight: 500,
        color: "#383838"
    },
    value: {
        fontSize: 30,
        fontWeight: 700,
        color: "#383838"
    }
})
function PrimaryWidget({ name, value }) {
    const classes = useStyles()
    return (
        <>
            <Card className={classes.root}>
                <Typography className={classes.title} gutterBottom>
                    {name}
                </Typography>
                <Typography className={classes.value}>
                    {value}
                </Typography>
            </Card>
        </>
    )
}

export default PrimaryWidget
