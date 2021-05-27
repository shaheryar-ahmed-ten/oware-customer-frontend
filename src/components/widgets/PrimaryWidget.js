import { Card, Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles({
    root: {
        border: "1px dotted black",
        boxSizing: "border-box",
        padding: "10px 10px"
    },
    title: {
        fontSize: 14,
    },
})
function PrimaryWidget({ name, value }) {
    const classes = useStyles()
    return (
        <>
            <Card className={classes.root}>
                <Typography className={classes.title} gutterBottom>
                    {name}
                </Typography>
                <Typography variant="h5" component="h2">
                    {value}
                </Typography>
            </Card>
        </>
    )
}

export default PrimaryWidget
