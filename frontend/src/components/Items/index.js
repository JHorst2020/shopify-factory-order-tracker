import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddItem from "./addNewItem"

//? Material UI
import { Grid } from "@mui/material";
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

//? Redux Store
import {getItems} from "../../store/items"

const Item = () => {

  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(getItems())
  },[])

  const allItems = useSelector(state => state.items.Items)

  const columns = [
    {field: "styleNumber", headerName:"Style #", maxWidth:10, flex:0},
    {field: "styleName", headerName:"Style Name", flex:1},
    {field:"styleType", headerName:"Type", flex:1},
    {field:"styleDesc", headerName:"Description", flex:1},
    {field:"color", headerName:"Color", flex:1},
    {field:"gender", headerName:"Gender", flex:1},
    
  ]; 

  return(
    <Grid container>
      <Grid item xs={12} sx={{height: "75vh", width:"100%", padding: 3}}>
        <Grid container alignItems='center' justifyContent='space-between' sx={{padding:3, backgroundColor:"#E5E5E5"}}>
          <Grid item >
            <Typography variant="h3" sx={{color:"#14213D"}}>Items</Typography>
          </Grid>
          <Grid item >
            <AddItem />
          </Grid>
        </Grid>
        <DataGrid rowHeight={38} columns={columns} rows={allItems} />
      </Grid>
    </Grid>
  )
}
export default Item;
