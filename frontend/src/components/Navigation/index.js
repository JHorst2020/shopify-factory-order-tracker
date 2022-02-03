import React, {useState} from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';
import {logout} from "../../store/session"

//? MATERIAL-UI
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";

//? MATERIAL-UI ICONS
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import FactoryIcon from "@mui/icons-material/Factory"; // Factory
import HandymanIcon from "@mui/icons-material/Handyman"; // Factory Orders
import StoreIcon from "@mui/icons-material/Store"; // Customer
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Customer Orders
import AddBusinessIcon from "@mui/icons-material/AddBusiness"; // Add Customer
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"; // Add Customer Order
import SellIcon from "@mui/icons-material/Sell"; // Item
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"; // Customer
import AddReactionIcon from "@mui/icons-material/AddReaction"; // Add Factory
import SettingsIcon from "@mui/icons-material/Settings"; // Configure
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const location = useLocation()
  const currentPage = location.pathname
  const history = useHistory()
  const dispatch = useDispatch()
  const [pageName, setPageName] = useState("Home")
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)
  const openMenu = Boolean(anchorEl)
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleMenuClick = (menuItem) => {
    setAnchorEl(null)
    setPageName(menuItem)
    if(menuItem == 'Home'){
      return history.push("/")
      }
    if(menuItem == "Customer Orders"){
      return history.push("customer-orders")
    }
    if(menuItem == "Factory Orders"){
      return history.push("factory-orders")
    }
      
    
    history.push(menuItem.toLowerCase())
      

  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async() => {
    await dispatch(logout())
    history.push("/")
  } 


  let sessionLinks;
  if (!sessionUser) {
    
      return null
    } else {
      sessionLinks = (
        <>
        <ProfileButton />
        <NavLink to="/signup" style={{margin:"5px"}}>Sign Up</NavLink>
        <NavLink to="/addItem" style={{margin:"5px"}}>Add Item</NavLink>
        <NavLink to="/addCustomer" style={{margin:"5px"}}>Add Customer</NavLink>
        <NavLink to="/addVendor" style={{margin:"5px"}}>Add Vendor</NavLink>
        <NavLink to="/addCustomerOrder" style={{margin:"5px"}}>Add New Order</NavLink>
        <NavLink to="/addFactoryOrder" style={{margin:"5px"}}>Add Factory Order</NavLink>
      </>
    );
  }

  return (
     <AppBar position='sticky' style={{backgroundColor:"#14213D"}}>
       <Toolbar>
         <IconButton size="large" edge="start" color="inherit" sx={{mr: 2}} onClick={handleClick}>
           <MenuIcon />
         </IconButton>
         <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
           {pageName}
         </Typography>
         <Menu anchorEl={anchorEl} open={openMenu} onClose={handleClose}>
           <Box sx={{ width: 320, maxWidth:"100%"}}>
            <List>
              <ListItemButton onClick={()=>handleMenuClick("Home")}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText>Home</ListItemText>
              </ListItemButton>
                <Divider />
              {/* <ListItemButton onClick={()=>handleMenuClick("Orders")}> */}
              <ListItemButton onClick={()=>setOpen(!open)}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText>Orders</ListItemText>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open}>
                <List>
                  <ListItemButton onClick={()=>handleMenuClick("Customer Orders")}>
                    <ListItemText inset>Customer Orders</ListItemText>
                  </ListItemButton>
                  <ListItemButton onClick={()=>handleMenuClick("Factory Orders")}>
                    <ListItemText inset>Factory Orders</ListItemText>
                  </ListItemButton>
                </List>
              </Collapse>
                <Divider />
              <ListItemButton onClick={()=>handleMenuClick("Vendors")}>
                <ListItemIcon>
                  <FactoryIcon />
                </ListItemIcon>
                <ListItemText>Vendors</ListItemText>
              </ListItemButton>
              {/* <ListItemButton>
                <ListItemIcon>
                  <HandymanIcon />
                </ListItemIcon>
                <ListItemText>Vendor Orders</ListItemText>
              </ListItemButton> */}
              {/* <Divider /> */}
              {/* <ListItemButton onClick={()=>handleMenuClick("Customers")}>
                <ListItemIcon>
                  <StoreIcon />
                </ListItemIcon>
                <ListItemText>Customers</ListItemText>
              </ListItemButton> */}
              {/* <ListItemButton>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText>Customer Orders</ListItemText>
              </ListItemButton> */}
              {/* <Divider />
              <ListItemButton onClick={()=>handleMenuClick("Items")}>
                <ListItemIcon>
                  <SellIcon />
                </ListItemIcon>
                <ListItemText>Items</ListItemText>
              </ListItemButton> */}
              <Divider />
              <ListItemButton onClick={()=>handleMenuClick("Configure")}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText>Configure</ListItemText>
              </ListItemButton>
            </List>
           </Box>
         </Menu>
         <Button color="primary" style={{backgroundColor:"#FCA311"}} variant="contained" onClick={handleLogout}>Logout</Button>
       </Toolbar>
     </AppBar>
  );
}

export default Navigation;