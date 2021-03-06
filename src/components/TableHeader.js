import {
  Grid,
  Paper,
  makeStyles,
} from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme => ({
  root: {
    // marginBottom: '20px',
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
          <Grid container justify="space-between" alignItems="center" spacing={1}>
            <Grid item xs={filterCount > 3 ? 4 : 5} >
              {searchInput}
            </Grid>
            <Grid container item xs={filterCount > 3 ? 8 : 7} justify={filterCount > 1 ? 'center' : 'flex-end'}>
              {
                buttons.map((button, index) => {
                  return (
                    <Grid container item xs={filterCount > 3 ? 3 : 4} key={index} justify='center'>
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
