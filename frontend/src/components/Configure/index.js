import React, { useState } from "react";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {addParentCompany} from "../../store/customers"
import AddCategory from "./addCategory.js"
import AddUser from "./addUser.js"

//?Material-UI
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

const Configure = () => {
  return (
    <Grid container>
      <Grid item xs={12} sx={{height: "75vh", width:"100%", padding: 3}}>
        <Grid container alignItems='center' justifyContent='space-between' sx={{padding:3, backgroundColor:"#E5E5E5"}}>
          <Grid item >
            <Typography variant="h3" sx={{color:"#14213D"}}>Configure</Typography>
          </Grid>
          <Grid item >
            <AddCategory />
          </Grid>
          <Grid item >
            <AddUser />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Configure