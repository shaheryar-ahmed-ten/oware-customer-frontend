import { Paper, Grid, Typography, TextField, Button, makeStyles, Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import Logo from '../../components/Logo';

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

const ForgetPassword = () => {
    const classes = useStyle();
    const [formErrors, setFormErrors] = useState(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>Some error message</Alert>);
    const [formSuccess, setFormSuccess] = useState(<Alert elevation={6} variant="filled" severity="success" onClose={() => setFormErrors('')}>Reset code has been on this email.</Alert>);
    const [email, setEmail] = useState('')
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
                    <Button variant="contained" color="primary" fullWidth="true">Send Reset Code</Button>
                </Box>
            </Paper>
        </Grid>
    )
};

export default ForgetPassword;
