import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//?Material-UI
import {Grid, Dialog, TextField, Select, Checkbox, FormGroup, FormControlLabel, InputAdornment, Switch, Stack, FormControl} from "@mui/material"
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
import { createTheme, ThemeProvider } from '@mui/material/styles'

//? Material UI Icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from '@mui/icons-material/Delete';

//? Redux Store
import {getCategories, addCategories} from "../../store/items"

import {signup, addUser, adminSignup} from "../../store/session"

const AdminSignup = () => {
    const dispatch = useDispatch()
    const [input, setInput] = useState("")
    const submit = async() => {
        await dispatch(adminSignup(input))
    }
    return(
        <Grid container>
            <TextField value={input} onChange={(e)=>setInput(e.target.value)}/>
            <Button onClick={submit}>Add</Button>
        </Grid>
    )
}

export default AdminSignup