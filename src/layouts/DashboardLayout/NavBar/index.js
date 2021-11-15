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
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useContext, useState } from "react";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import ClassOutlinedIcon from "@material-ui/icons/ClassOutlined";
import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import { useLocation, useNavigate } from "react-router-dom";
// import owareLogo from '../../../assets/logo/oware-logo-black.png'
import { SharedContext } from "../../../utils/common";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import HttpsOutlinedIcon from "@material-ui/icons/HttpsOutlined";
import { checkPermission, removeAuth } from "../../../utils/auth";
import { CP_DASHBOARD_FULL, CP_INWARD_FULL, CP_ORDER_FULL, CP_PRODUCT_FULL } from "../../../PermissionConstants";
import EventNoteOutlinedIcon from "@material-ui/icons/EventNoteOutlined";
import AssignmentReturnedOutlinedIcon from "@material-ui/icons/AssignmentReturnedOutlined";
import Logo from "../../../components/Logo";
const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "#FFFFFF",
    border: "0",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05);",
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    visibility: "hidden",
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
    color: "black",
    height:"0px"
  },
  userAvatar: {
    display: "inline-flex",
    alignItems: "center",
  },
  hide: {
    visibility: "hidden",
    width:"18%"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    border: "0",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05);",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: "#FFFFFF",
    border: "0",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05);",
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
    backgroundColor: "#FFFFFF",
    border: "0",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05);",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: theme.spacing(0, 3),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
   
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  listItemText: {
    fontSize: "16px",
    fontWeight: "500",
  },
  userName: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: "17px",
  },
  userType: {
    fontSize: 14,
    lineHeight: "17px",
    color: "#CAC9C9",
  },
  drawerHandleIcon: {
    backgroundColor: "transparent",
    postion: "absolute",
    bottom: "0",
  },
  menuDropdownStyle: {
    transform: "translateY(5%)",
  },
  menuItemStyle: {
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    paddingRight: "100px",
  },
}));
function Navbar(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const { currentUser, setCurrentUser } = useContext(SharedContext);
  let navigate = useNavigate();
  let currentLocation = useLocation().pathname;
  const [anchorEl, setAnchorEl] = useState(null);
  const navList = [
    {
      title: "Dashboard",
      icon: <HomeOutlinedIcon fontSize="small" />,
      route: "/dashboard",
      color: currentLocation.includes("dashboard") ? "#01D5FF" : "#383838",
      bgColor: currentLocation.includes("dashboard") ? "rgba(48, 220, 255, 0.05)" : "#FFFFFF",
      canActivate: checkPermission(currentUser, CP_DASHBOARD_FULL),
    },
    {
      title: "Inwards",
      icon: <AssignmentReturnedOutlinedIcon fontSize="small" />,
      route: "/operation-transactions/inwards",
      color: currentLocation.includes("inwards") ? "#01D5FF" : "#383838",
      bgColor: currentLocation.includes("inwards") ? "rgba(48, 220, 255, 0.05)" : "#FFFFFF",
      canActivate: checkPermission(currentUser, CP_INWARD_FULL),
    },
    {
      title: "Orders",
      icon: <EventNoteOutlinedIcon fontSize="small" />,
      route: "/operation-transactions/orders",
      color: currentLocation.includes("orders") ? "#01D5FF" : "#383838",
      bgColor: currentLocation.includes("orders") ? "rgba(48, 220, 255, 0.05)" : "#FFFFFF",
      canActivate: checkPermission(currentUser, CP_ORDER_FULL),
    },
    {
      title: "Products",
      icon: <ClassOutlinedIcon fontSize="small" />,
      route: "/products",
      color: currentLocation.includes("products") ? "#01D5FF" : "#383838",
      bgColor: currentLocation.includes("products") ? "rgba(48, 220, 255, 0.05)" : "#FFFFFF",
      canActivate: checkPermission(currentUser, CP_PRODUCT_FULL),
    },
    {
      title: "Logistics",
      icon: <LocalShippingOutlinedIcon fontSize="small" />,
      route: "/logistics",
      color: currentLocation.includes("logistics") ? "#01D5FF" : "#383838",
      bgColor: currentLocation.includes("logistics") ? "rgba(48, 220, 255, 0.05)" : "#FFFFFF",
      canActivate: checkPermission(currentUser, CP_PRODUCT_FULL),
    },
  ];
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    removeAuth();
    setCurrentUser(null);
    navigate(`/`);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (route) => {
    navigate(route);
  };
  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar className={classes.toolBar}>
          {/* <a href = "/dashboard" ><img src={<Logo/>} alt='' className={clsx({
            [classes.hide]: open,
          })} /></a> */}
          <Box
            className={clsx({
              [classes.hide]: open,
            })}
          >
            <Logo />
          </Box>

          {/* <p> &nbsp; </p> */}
          <Box display="flex" alignItems="center" textAlign="right">
            <Box>
              <Typography className={classes.userName}>
                {currentUser ? currentUser.firstName + " " + currentUser.lastName : ""}
              </Typography>
              <Typography className={classes.userType}>{currentUser ? currentUser.username : ""}</Typography>
            </Box>
            <Box p={1}>
              <Avatar>{currentUser.firstName.charAt(0)}</Avatar>
            </Box>
            <Box p={1}>
              <KeyboardArrowDownOutlinedIcon onClick={handleClick} />
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className={classes.menuDropdownStyle}
              >
                <MenuItem
                  onClick={() => {
                    navigate(`/profile`);
                  }}
                >
                  <IconButton>
                    <PersonOutlineOutlinedIcon />
                  </IconButton>
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate(`/profile/security`);
                  }}
                >
                  <IconButton>
                    <HttpsOutlinedIcon />
                  </IconButton>
                  Security
                </MenuItem>
                <Divider />
                <MenuItem className={classes.menuItemStyle} onClick={handleLogout}>
                  <IconButton>
                    <ExitToAppOutlinedIcon />
                  </IconButton>
                  Logout
                </MenuItem>
              </Menu>
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
          {/* <a href = "/dashboard" ><img src={owareLogo} alt='' /></a> */}
          {/* Main Logo Of NavBar */}
          <Logo />
        </div>
        <Divider />
        <List>
          {navList.map((item, index) =>
            item.canActivate ? (
              <ListItem
                button
                key={index}
                onClick={() => {
                  handleNavigation(item.route);
                }}
                style={{ backgroundColor: item.bgColor }}
              >
                <ListItemIcon style={{ color: item.color }}>{item.icon}</ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  style={{ color: item.color }}
                  primary={item.title}
                />
              </ListItem>
            ) : (
              ""
            )
          )}
        </List>
        <IconButton
          style={{ backgroundColor: "transparent", position: "absolute", bottom: "0", right: "0" }}
          disableRipple
          disableFocusRipple
          onClick={!open ? handleDrawerOpen : handleDrawerClose}
        >
          {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Drawer>
    </div>
  );
}

export default Navbar;
