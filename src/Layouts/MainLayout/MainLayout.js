import { makeStyles } from '@material-ui/core'
import React, { useContext } from 'react'
import { Outlet } from 'react-router'
import LoaderOverlay from '../../Components/LoaderOverlay'
import { SharedContext } from '../../Utils/common'


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        width: '100%'
    },
    wrapper: {
        display: 'flex',
        flex: '1 1 auto', /* flex-grow | flex-shrink | flex-basis */
        overflow: 'hidden',
    },
    contentContainer: {
        display: 'flex',
        flex: '1 1 auto', /* flex-grow | flex-shrink | flex-basis */
        overflow: 'hidden',
    },
    content: {
        flex: '1 1 auto', /* flex-grow | flex-shrink | flex-basis */
        height: '100%',
        overflow: 'auto',
    }
}))

function MainLayout() {
    const classes = useStyles()
    const { isLoading } = useContext(SharedContext);

    return (
        <div className={classes.root}>
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

export default MainLayout
