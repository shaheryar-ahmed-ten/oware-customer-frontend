import { Box, Button, Grid, makeStyles, TextField, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import React, { useState } from 'react'
import { getURL } from '../../../utils/common';


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
        padding: '10px 30px',
        marginTop: '10px'
    },
    customFieldLabel: {
        color: '#383838',
        fontSize: 14,
        lineHeight: '17px',
        fontWeight: '400'
    },
}))
function Security() {
    const classes = useStyles()
    const [userFields, setUserFields] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })
    const [formErrors, setFormErrors] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const updateUserPassword = data => {
        if (userFields.newPassword === '' || userFields.confirmNewPassowrd === '' || userFields.currentPassword === '') {
            setFormErrors("Fields must not be empty.");
            return 0
        }
        else if (userFields.newPassword === userFields.confirmNewPassword) {
            axios.patch(getURL(`/user/me/password`), {
                oldPassword: userFields.currentPassword,
                password: userFields.newPassword
            })
                .then((res) => {
                    if (!res.data.success) {
                        setFormErrors(res.data.message);
                        return
                    }
                    setFormSuccess(res.data.message)
                })
                .catch((err) => {
                    console.log(err.message)
                    setFormErrors(err.message);
                })
        }
        else {
            setFormErrors("New password and confirm password do not match.");
        }
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
                    <Grid item xs={12} className={classes.fieldGrid}>
                        <Typography className={classes.customFieldLabel}>Current Password</Typography>
                        <TextField
                            id="standard-full-width"
                            fullWidth
                            type="password"
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userFields.currentPassword}
                            onChange={(e) => { setUserFields((prevState) => ({ ...prevState, currentPassword: e.target.value })); setFormSuccess(null); setFormErrors(null) }}
                        />
                        <br />
                        <br />
                        <Typography className={classes.customFieldLabel}>New Password</Typography>
                        <TextField
                            id="standard-full-width"
                            fullWidth
                            type="password"
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userFields.newPassword}
                            onChange={(e) => { setUserFields((prevState) => ({ ...prevState, newPassword: e.target.value })); setFormSuccess(null); setFormErrors(null) }}
                        />
                        <br />
                        <br />
                        <Typography className={classes.customFieldLabel}>Confirm New Password</Typography>
                        <TextField
                            id="standard-full-width"
                            fullWidth
                            type="password"
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userFields.confirmNewPassword}
                            onChange={(e) => { setUserFields((prevState) => ({ ...prevState, confirmNewPassword: e.target.value })); setFormSuccess(null); setFormErrors(null) }}
                        />
                        {
                            formErrors ?
                                <Alert severity="error">{formErrors}</Alert>
                                : null
                        }
                        {
                            formSuccess ?
                                <Alert severity="success">{formSuccess}</Alert>
                                :
                                null
                        }
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
