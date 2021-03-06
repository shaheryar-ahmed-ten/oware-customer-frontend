import { Box, Button, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router';
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

function ChangePassword() {
    const params = useParams();
    const classes = useStyle();
    const [formErrors, setFormErrors] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState(params.otp);
    const [showLoginBtn, setShowLoginBtn] = useState(false)
    let navigate = useNavigate();

    const handleSetNewPassword = () => {
        setFormErrors(null);
        setFormSuccess(null);
        if (password !== confirmPassword) {
            setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>Passwords do not match.</Alert>)
        }
        else {
            axios.post(getURL(`/user/auth/change-password/${params.id}/${params.otp}`), { password })
                .then(res => {
                    if (res.data.success) {
                        setFormSuccess(<Alert elevation={6} variant="filled" severity="success" onClose={() => setFormErrors('')}>Password has been changed.</Alert>);
                        setShowLoginBtn(true)
                    }
                    else
                        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.message}</Alert>);
                })
                .catch(err => {
                    setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{err.response.data.message}</Alert>);
                })
        }
    }
    return (
        <Grid>
            <Paper elevation={0} className={classes.paperStyle}>
                <Grid align="center">
                    <Logo variant="h1" />
                </Grid>
                {!params.otp ?
                    [<Grid>
                        <Typography className={classes.text} variant="p" component="div" align="center">Please enter your OTP and new password.</Typography>
                    </Grid>,
                    <Box mt={2}>
                        <TextField type="password" placeholder="******" label="OTP" variant="outlined" fullWidth="true" required
                            value={otp} onChange={(e) => { setOtp(e.target.value) }} />
                    </Box>]
                    : ''}
                <Box mt={2}>
                    <TextField type="password" placeholder="****" label="New Password" variant="outlined" fullWidth="true" required
                        value={password} onChange={(e) => { setPassword(e.target.value) }} />
                </Box>
                <Box mt={2}>
                    <TextField type="password" placeholder="****" label="Confirm New Password" variant="outlined" fullWidth="true" required
                        value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
                </Box>
                <Box mt={2}>
                    {formErrors}
                    {formSuccess}
                </Box>
                <Box mt={2}>
                    {
                        showLoginBtn ?
                            <Button variant="contained" color="primary" fullWidth="true" onClick={() => navigate('/login')}>Go to login</Button>
                            :
                            <Button variant="contained" color="primary" fullWidth="true" onClick={handleSetNewPassword} >Reset Password</Button>
                    }
                </Box>
            </Paper>
        </Grid>
    )
}

export default ChangePassword;
