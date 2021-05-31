import {
  Grid,
  Paper,
  Typography,
  makeStyles,
  InputBase
} from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '20px',
  },
  pageHeader: {
    padding: theme.spacing(2),
    display: 'flex',

  },
  heading: {
    fontWeight: 'bolder',
  },
}))

const TableHeader = ({ searchInput, buttons }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Paper elevation={0} square className={classes.root}>
        <div className={classes.pageHeader}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              {searchInput}
            </Grid>
            {
              buttons.map((button) => {
                return (
                  <Grid item>
                    {button}
                  </Grid>
                )
              })
            }
          </Grid>
        </div>
      </Paper>
    </React.Fragment >
  )
}

export default TableHeader
