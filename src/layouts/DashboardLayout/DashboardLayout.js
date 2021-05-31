import { makeStyles } from '@material-ui/core'
import React, { useContext } from 'react'
import { Outlet } from 'react-router';
import LoaderOverlay from '../../components/LoaderOverlay';
import NavBar from '../../layouts/DashboardLayout/NavBar';
import { SharedContext } from '../../utils/common';

const useStyles = makeStyles((theme) => ({
    /* flex-grow | flex-shrink | flex-basis */
    root: {
        backgroundColor: "#E5E5E5",
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        width: '100%'
    },
    wrapper: {
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden',
        marginTop: 64,
        [theme.breakpoints.up('lg')]: {
            paddingLeft: 64
        }
    },
    contentContainer: {
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden'
    },
    content: {
        flex: '1 1 auto',
        height: '100%',
        overflow: 'auto'
    }
}));

function DashboardLayout() {
    const classes = useStyles()
    const { isLoading } = useContext(SharedContext);
    return (
        <div className={classes.root}>
            <NavBar />
            <div className={classes.wrapper}>
                <div className={classes.contentContainer}>
                    <div className={classes.content}>
                        {isLoading ? <LoaderOverlay /> : ''}
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout
