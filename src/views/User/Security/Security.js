import { Box, Button, Grid, makeStyles, TextField, Typography } from '@material-ui/core'
import axios from 'axios';
import React, { useContext, useState } from 'react'
import { getURL, SharedContext } from '../../../utils/common';


const useStyles = makeStyles((theme) => ({
    gridContainer: {
        boxSizing: 'border-box',
        [theme.breakpoints.up('lg')]: {
            paddingRight: 30,
            paddingTop: 30,
            paddingBottom: 30
        },
        height: '95%',
    },
    heading: {
        fontWeight: "600"
    },
    contentContainer: {
        backgroundColor: '#FFFFFF',
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)",
        borderRadius: '4px',
        boxSizing: 'border-box',
        border: '1px solid #F0F0F0',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        flexFlow: 'column',
        "& .MuiGrid-root": {
            padding: '32px 32px'
        }
    },
    fieldGrid: {
        // width: 303,
        paading: '19px 19px'
    },
    saveBtn: {
        backgroundColor: '#01D2FF',
        color: 'white',
        border: '1px solid #01D2FF',
        padding: '10px 30px'
    }
}))
function Security() {
    const classes = useStyles()
    const { currentUser } = useContext(SharedContext);
    const [userFields, setUserFields] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })
    const updateUserPassword = data => {
        
    };
    return (
        <>
            <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        <Box className={classes.heading}>Security</Box>
                    </Typography>
                </Grid>
                <Grid container item xs={12} className={classes.contentContainer}>
                    <Grid item xs={4} className={classes.fieldGrid}>
                        <TextField
                            id="standard-full-width"
                            label="Current Passowrd"
                            fullWidth
                            type="password"
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userFields.currentPassword}
                            onChange={(e) => { setUserFields((prevState) => ({ ...prevState, currentPassword: e.target.value })) }}
                        />
                        <TextField
                            id="standard-full-width"
                            label="New Passowrd"
                            fullWidth
                            type="password"
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userFields.newPassword}
                            onChange={(e) => { setUserFields((prevState) => ({ ...prevState, newPassword: e.target.value })) }}
                        />
                        <TextField
                            id="standard-full-width"
                            label="Confirm New Passowrd"
                            fullWidth
                            type="password"
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userFields.confirmNewPassword}
                            onChange={(e) => { setUserFields((prevState) => ({ ...prevState, confirmNewPassword: e.target.value })) }}
                        />
                        <Button variant="contained" className={classes.saveBtn} onClick={() => { updateUserPassword(userFields) }}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}


export default Security
