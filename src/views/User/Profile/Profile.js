import { Box, Button, Grid, makeStyles, TextField, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { getURL, SharedContext, setUser } from '../../../utils/common';

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
        padding: '12px 30px',
        marginTop: '20px'
    },
    customFieldLabel: {
        color: '#383838',
        fontSize: 14,
        lineHeight: '17px',
        fontWeight: '400'
    },
    customField: {
        // border: '1px solid black'
    }
}))
function Profile() {
    const classes = useStyles()
    const { currentUser, setCurrentUser } = useContext(SharedContext);
    const [userFields, setUserFields] = useState({
        firstName: currentUser ? currentUser.firstName : '',
        lastName: currentUser ? currentUser.lastName : ''
    })
    const [formErrors, setFormErrors] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const updateUser = data => {
        if (userFields.firstName === '' || userFields.lastName === '') {
            setFormErrors("Fields must not be empty.");
        }
        else {
            const updatedUser = {
                firstName: data.firstName,
                lastName: data.lastName,
                username: currentUser.username,
                phone: currentUser.phone,
                email: currentUser.email
            }
            axios.put(getURL(`/user/me`), updatedUser)
                .then(res => {
                    if (!res.data.success) {
                        setFormErrors(res.data.message);
                        return
                    }
                    let _user = res.data.data;
                    currentUser.firstName = _user.firstName;
                    currentUser.lastName = _user.lastName;
                    currentUser.phone = _user.phone;
                    setUser(currentUser);
                    setCurrentUser(currentUser);
                    setFormSuccess(res.data.message)
                })
                .catch((err) => {
                    setFormErrors(err.message);
                })
        }

    };
    return (
        <>
            <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        <Box className={classes.heading}>Profile</Box>
                    </Typography>
                </Grid>
                <Grid container item xs={12} className={classes.contentContainer}>
                    <Grid item xs={4} className={classes.fieldGrid}>
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
                        <Typography className={classes.customFieldLabel}>First Name</Typography>
                        <TextField
                            className={classes.customField}
                            id="standard-full-width"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userFields.firstName}
                            onChange={(e) => { setUserFields((prevState) => ({ ...prevState, firstName: e.target.value })); setFormSuccess(null); setFormErrors(null) }}
                        />
                        <br />
                        <br />
                        <Typography className={classes.customFieldLabel}>Last Name</Typography>
                        <TextField
                            className={classes.customFieldLabel}
                            id="standard-full-width"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userFields.lastName}
                            onChange={(e) => { setUserFields((prevState) => ({ ...prevState, lastName: e.target.value })); setFormSuccess(null); setFormErrors(null) }}
                        />
                        <Button variant="contained" className={classes.saveBtn} onClick={() => { updateUser(userFields) }}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default Profile
