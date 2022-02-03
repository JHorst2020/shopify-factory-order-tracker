import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useHistory} from "react-router-dom"

//? Material UI
import {Grid, Dialog, TextField, Select, Checkbox, FormGroup, FormControlLabel, InputAdornment, Switch} from "@mui/material"
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
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from '@mui/material/styles'


//? Redux Store
import {getUnfulfilledShopifyOrders, getShopifyInformation } from"../../store/orders"

//? Components
import ViewCustomerOrderModal from "../Modals/viewCustomerOrder"
import CreateCustomerOrderModal from "../Modals/createNewCustomerOrder"

const theme = createTheme({
  palette:{
      button: {
          main:'#0091E2',
          light:'#0091E230',
          dark:'#30b5ff',
          contrastText:'white'
      },
  },
  typography: {
      h5: {
          fontWeight: "bold",
          color: "#0091E2"
          // color: "red"
      },
      h6: {
          fontWeight: "bold",
          color: "#0091E2",
      },
      h7: {
          color: "#8F94A4",
          fontWeight: 600,
      },
      body1: {
          color: "rgba(98, 98, 98, 1)",
          // fontWeight: 600,
      },
  },

})


const CustomerList = () => {
  const dispatch = useDispatch();
  const history = useHistory()
 const [info, setInfo] = useState([])

//   const initialLoad = async() =>{
//      const shopifyInfo = await dispatch(getShopifyInformation())
//      setInfo(shopifyInfo.linkHeaders)
//      console.log("shopify info:   ", shopifyInfo.linkHeaders)
//   }
//   useEffect(() => {
//     initialLoad()
//   }, []);

 

  return (
    <Grid container sx={{p:3}}>
        {info.map(ele=>{
            <Typography>{ele}</Typography>
        })}
    </Grid>
  );
};

export default CustomerList;
