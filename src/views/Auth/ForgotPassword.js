import { Paper, Grid, Typography, TextField, Button, makeStyles, Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import Logo from '../../components/Logo';
import { getURL } from '../../utils/common';
import axios from 'axios';

const useStyle = makeStyles(theme => ({
    paperStyle: {
        marginBottom: '20px',
        padding: 5,
        height: '55vh',
        maxWidth: '350px',
        minWidth: 'auto',
        margin: '10% auto'
    },
    text: {
        fontSize: '14px',
        opacity: '0.6',
        padding: '0px',
        marginTop: '20px',
    }
}))

const ForgotPassword = () => {
    const classes = useStyle();
    const [formErrors, setFormErrors] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [email, setEmail] = useState('');
    const [disableSendOtpBtn, setDisableSendOtpBtn] = useState(false)
    const sendForgotPasswordEmail = () => {
        setFormErrors(null);
        setFormSuccess(null);
        axios.post(getURL('/user/auth/forgot-password'), { email })
            .then(res => {
                if (res.data.success) {
                    setFormSuccess(<Alert elevation={6} variant="filled" severity="success" onClose={() => setFormErrors('')}>Reset code has been to the email.</Alert>);
                    setDisableSendOtpBtn(true)
                }
                else
                    setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.message}</Alert>);
            })
            .catch(err => {
                setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{err.response.data.message}</Alert>);
            })
    }

    return (
        <Grid>
            <Paper elevation={0} className={classes.paperStyle}>
                <Grid align="center">
                    <Logo variant="h1" />
                </Grid>
                <Grid>
                    <Typography className={classes.text} variant="p" component="div" align="center">Forgot your password? Enter your email address
                        and we'll email you the password reset link</Typography>
                </Grid>

                <Box mt={4}>
                    <TextField placeholder="name@example.com" label="Email" variant="outlined" fullWidth="true" required
                        value={email} onChange={(e) => { setEmail(e.target.value) }} />
                </Box>

                <Box mt={2}>
                    {formErrors}
                    {formSuccess}
                </Box>
                <Box mt={2}>
                    <Button variant="contained" color="primary" fullWidth="true" onClick={sendForgotPasswordEmail} disabled={disableSendOtpBtn ? true : false}>Send Reset Code</Button>
                </Box>
            </Paper>
        </Grid>
    )
};

export default ForgotPassword;
