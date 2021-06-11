import { Box, Button, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react'
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

function ChangePassword() {
    const classes = useStyle();
    const [formErrors, setFormErrors] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSetNewPassword = () => {
        if (password !== confirmPassword) {
            setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>Some error message</Alert>)
        }
        else {
            setFormSuccess(<Alert elevation={6} variant="filled" severity="success" onClose={() => setFormSuccess('')}>Your password has been updated.</Alert>)
        }
    }
    return (
        <Grid>
            <Paper elevation={0} className={classes.paperStyle}>
                <Grid align="center">
                    <Logo variant="h1" />
                </Grid>
                <Grid>
                    <Typography className={classes.text} variant="p" component="div" align="center">Please enter your new password.</Typography>
                </Grid>
                <Box mt={4}>
                    <TextField type="password" placeholder="****" label="New Password" variant="outlined" fullWidth="true" required
                        value={password} onChange={(e) => { setPassword(e.target.value) }} />
                </Box>
                <Box mt={4}>
                    <TextField type="password" placeholder="****" label="Confirm New Password" variant="outlined" fullWidth="true" required
                        value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
                </Box>
                <Box mt={2}>
                    {formErrors}
                    {formSuccess}
                </Box>
                <Box mt={2}>
                    <Button variant="contained" color="primary" fullWidth="true" onClick={handleSetNewPassword}>Reset Password</Button>
                </Box>
            </Paper>
        </Grid>
    )
}

export default ChangePassword
