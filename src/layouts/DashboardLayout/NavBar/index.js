import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography,
  useTheme
} from '@material-ui/core';
import clsx from 'clsx';
import React, { useContext, useState } from 'react'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import BorderClearOutlinedIcon from '@material-ui/icons/BorderClearOutlined';
import HomeWorkOutlinedIcon from '@material-ui/icons/HomeWorkOutlined';
import ClassOutlinedIcon from '@material-ui/icons/ClassOutlined';
import { useNavigate } from 'react-router-dom';
import owareLogo from '../../../assets/logo/owareLogo.png'
import { SharedContext } from '../../../utils/common';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
const drawerWidth = 250;

const navList = [{
  title: "Dashboard",
  icon: <HomeOutlinedIcon />,
  route: '/dashboard'
},
{
  title: "Inwards",
  icon: <GetAppOutlinedIcon />,
  route: '/operation-transactions/inbound-transactions'
},
{
  title: "Orders",
  icon: <BorderClearOutlinedIcon />,
  route: '/dashboard'
},
{
  title: "Warehouse",
  icon: <HomeWorkOutlinedIcon />,
  route: '/dashboard'
},
{
  title: "Products",
  icon: <ClassOutlinedIcon />,
  route: '/dashboard'
},
]

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#FFFFFF',
    border: "0",
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05);'
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    visibility: 'hidden'
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
    color: "black"
  },
  userAvatar: {
    display: "inline-flex",
    alignItems: "center",
  },
  hide: {
    visibility: 'hidden',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    border: "0",
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05);'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#FFFFFF',
    border: "0",
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05);'
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    backgroundColor: '#FFFFFF',
    border: "0",
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05);'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  listItemText: {
    fontSize: '16px',
    fontWeight: '500',
  },
  userName: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: "17px",
  },
  userType: {
    fontSize: 16,
    lineHeight: "17px",
    color: "#CAC9C9"
  }
}));
function Navbar() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(SharedContext);
  let navigate = useNavigate();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (route) => {
    navigate(route)
  }
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}>
        <Toolbar className={classes.toolBar}>
          <img src={owareLogo} alt='' />
          <Box display="flex" alignItems="center">
            <Box>
              <Typography className={classes.userName}>{currentUser.username || ''}</Typography>
              <Typography className={classes.userType}>{currentUser.Role.type.toLowerCase() || ''}</Typography>
            </Box>
            <Box p={1}>
              <Avatar>U</Avatar>
            </Box>
            <Box p={1}>
              <KeyboardArrowDownOutlinedIcon />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {navList.map((item, index) => (
            <ListItem button key={index} onClick={() => { handleNavigation(item.route) }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText classes={{ primary: classes.listItemText }} primary={item.title} />
            </ListItem>
          ))}
        </List>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx({
            [classes.hide]: open,
          })}
          style={{ position: "absolute", bottom: '0', left: "25%" }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Drawer>
    </div>
  )
}

export default Navbar
