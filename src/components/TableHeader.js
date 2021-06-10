import {
  Grid,
  Paper,
  makeStyles,
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

const TableHeader = ({ searchInput, buttons, filterCount }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Paper elevation={0} square className={classes.root}>
        <div className={classes.pageHeader}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item xs={filterCount > 3 ? 5 : 6}>
              {searchInput}
            </Grid>
            <Grid container item xs={filterCount > 3 ? 7 : 6} justify="space-between">
              {
                buttons.map((button, index) => {
                  return (
                    <Grid item key={index}>
                      {button}
                    </Grid>
                  )
                })
              }
            </Grid>
          </Grid>
        </div>
      </Paper>
    </React.Fragment >
  )
}

export default TableHeader
