import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useHistory} from "react-router-dom"
import { format, compareAsc } from 'date-fns'
import { jsPDF } from "jspdf";
import {htmlPDFNewTab, htmlPDFSaveFile, htmlPDFBase64} from "../Files/htmlPDF"


//? Material UI
import {Grid, Dialog, TextField, Select, Checkbox, FormGroup, FormControlLabel, InputAdornment, Switch, InputLabel} from "@mui/material"
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
import {getBGNExchangeRate, updateVendorPricing, createVendorPricing, getVendorPricing, updateFactoryOrderStatus, updateLineItemStatus, getAllVendorOrders, sendEmail, getFactoryInfo} from "../../store/vendors" 
import {getItems} from "../../store/items"
import {getCustomerAddress} from "../../store/customers"

//? Components
import PackingList from "../Files/packingList"
import FactoryPO from "../Files/factoryPO"

const theme = createTheme({
    palette:{
        button: {
            main:'#0091E2',
            light:'#0091E230',
            dark:'#30b5ff',
            contrastText:'white'
        },
        button2: {
            main:'#FCA311',
            // light:'#FCA31130',
            // dark:'#30b5ff',
            contrastText:'white'
        },
    },
    typography: {
        h5: {
            fontWeight: "bold",
            // color: "#14213D"
            // color: "white"
            color: "#FCA311"
        },
        h6: {
            fontWeight: "600",
            color: "rgba(98, 98, 98, 1)",
        },
        h7: {
            color: "#8F94A4",
            fontWeight: 600,
        },
        body1: {
            color: "#14213D",
            // fontWeight: 600,
        },
    },
  
  })

const FactoryOrderModal = (props) => {
    const currVendor = props.vendor
    // console.log("these are the propsasdf :    ", props)
    const info = props.props
    const reloadInfo = props.reloadInfo
    const dispatch = useDispatch()

    const shopifyInfo = useSelector(state => state.orders.shopifyOrders)
    const categoryList = useSelector(state => state.items.Categories)
    const pricingList = useSelector(state => state.vendor.pricing)
    const allItemList = useSelector(state => state.items.Items.allItems)


    const [factoryPODate, setFactoryPODate] = useState("")
    const [lineItems, setLineItems] = useState([])
    const [itemName, setItemName] = useState([])
    const [markedItems, setMarkedItems] = useState([])
    const [markedItemsId, setMarkedItemsId] = useState([])
    const [markedItemCount, setMarkedItemCount] = useState(0)
    const [customerNotes, setCustomerNotes] = useState("")
    const [updateFactoryStatus, setUpdateFactoryStatus] = useState("")
    const [updateItemStatus, setUpdateItemStatus] = useState("")
    const [shipAddy, setShipAddy] = useState({})
    const [openSendEmail, setOpenSendEmail] = useState(false)
    const [poAttach, setPoAttach] = useState(false)
    const [plAttach, setPlAttach] = useState(false)
    const [factoryEmail, setFactoryEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")
    const [disableSubmit, setDisableSubmit] = useState(false)
    // const [factoryPOData, setFactoryPOData] = useState("")
   

    const customerName = `${info?.CustomerOrder?.customerFirstName} ${info?.CustomerOrder?.customerLastName}`
    const poDate = info?.createdAt //Used to set factoryPODate state
    const shopifyOrderNumber = info?.CustomerOrder?.shopifyOrderNumber
    const shipMethod = info?.CustomerOrder?.shipToCustomer
    const customerStatus = info?.CustomerOrder?.status
    const customerOrderShipToAddressId = info?.CustomerOrder?.shipToAddress
    const factoryCurrency = info?.Factory?.currency
    const factoryId = info?.Factory?.id
    const factoryName = info?.Factory?.name
    const factoryPO = info?.factoryPO
    const orderedLineItems = info?.LineItems
    const isOrderActive = info?.isActive
    const isOrderPending = info?.isPending
    const isOrderShipped = info?.isShipped


    const factoryInformation = {
        factoryPO:factoryPO,
        factoryName:factoryName,
        poDate,
    }

   
 

    const initialLoad = async() => {
        const factoryInformation = await dispatch(getFactoryInfo({id: factoryId}))
        setSubject(`New Order: ${factoryName} - PO #${factoryPO}`)
        setBody(`Здравейте! Има нова поръчка за ${factoryName} - PO #${factoryPO}.`)
        // console.log("factoryinfo:   ", factoryInformation?.ContactInfo?.email)
        setFactoryEmail(factoryInformation?.ContactInfo?.email)
        if(allItemList == null){
            const currItemList = await dispatch(getItems())
            setItemName(currItemList.allItems)
        }
        if(poDate != null){
            const formatYear = poDate.split("T")[0].split("-")[0]
            const formatMonth = poDate.split("T")[0].split("-")[1]
            const formatDay = poDate.split("T")[0].split("-")[2]
            setFactoryPODate(`${formatMonth}/${formatDay}/${formatYear}`)
        }

        if(Array.isArray(orderedLineItems)){
            setLineItems(orderedLineItems)
        }

        if(Array.isArray(allItemList)){
            setItemName(allItemList)
        }
        if(shipMethod == true){
            const addy = await dispatch(getCustomerAddress({shipToId: customerOrderShipToAddressId}))
            const addyPayload = {
                name: `${addy.firstName} ${addy.lastName}`,
                address1: addy.address1,
                address2: addy.address2,
                city: addy.city,
                state: addy.state,
                zipCode: addy.zipCode,
                country: addy.country,
                email: addy.email || "info@mydolcessa.com",
                phone: addy.phone || "702-842-4115"
            }
            setShipAddy(addyPayload)
        } else {
            const addyPayload = {
                name: `Katya Leoncio`,
                address1: '6551 S Las Vegas Blvd ',
                address2: 'Suite 147',
                city: 'Las Vegas',
                state: 'NV',
                zipCode: '89118',
                country: 'USA',
                email:"info@mydolcessa.com",
                phone:"702-842-4115"
            }
            setShipAddy(addyPayload)

        }

    }

    useEffect(()=>{initialLoad(props)},[])

  

    const handleCloseModal = () => {
        props.closeModal(false)
        // console.log("this is the categoryList:    ", categoryList)
        // console.log("this is the pricingList:    ", pricingList)
        // console.log("this is the pricingList:    ", combinedCatPrice)
        // console.log("this is the currFactoryPricing:    ", currFactoryPricing)
        // props.closeModal(false)
    }

    const renderCellFormat = (input) => {
        return(
          <Typography variant='body1'>{input}</Typography>
        )
      }

    const renderQuantityCellFormat = (input) => {
        const orderMatrix = `${input.xs}-${input.s}-${input.m}-${input.l}-${input.xl}`
        return(
          <Typography variant='body1'>{orderMatrix}</Typography>
        )
      }

    const renderNameCellFormat = (input) => {
        const currItem = itemName.find(x => x.id == input )
        const cellValue = `${currItem?.item} - ${currItem?.itemName}`
        return(
        //   <Typography variant='body1'>Hello</Typography>
          <Typography variant='body1'>{cellValue}</Typography>
        )
      }
      const columns = [
        {field:'orderNum', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Style</Typography>)}, renderCell: (e)=>renderNameCellFormat(e.row.item) },
        {field:'quantity', flex:1, renderHeader:()=>{return(<Typography variant='h7'>XS-XL</Typography>)}, renderCell: (e)=>renderQuantityCellFormat(e.row) },
        {field:'status', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Status</Typography>)}, renderCell: (e)=>renderCellFormat(e.row.status) },
      ]

     

      const handleUpdateState = (state) => {
        //   console.log("this is state:  ", state)
          if(state.selection.length == markedItemCount)return
        //   const lineItems = [
        //     {id:1, quantity:1, sku:"19032T", name:"Helios Chevron Top", size:"Medium"},
        //     {id:2, quantity:1, sku:"19032B", name:"Helios Chevron Bottom", size:"Large"},
        //   ]
        const markedArr = []
        state.selection.forEach((ele, index) => {
            let currItemArr = []
            const currItem = state.rows.idRowsLookup[ele]
            const findItem = itemName.find(x => x.id == currItem.item )
            // console.log("this is ele:   ", {currItem, findItem, itemName, ele})
            if(currItem.xs > 0){
                currItemArr.push({
                    quantity: currItem.xs,
                    id: Math.random()*10000000000000000,
                    sku: `${findItem.item}-XS`,
                    name: findItem.itemName,
                    size:"XS"
                })
            }
            if(currItem.s > 0){
                currItemArr.push({
                    quantity: currItem.s,
                    id: Math.random()*10000000000000000,
                    sku: `${findItem.item}-S`,
                    name: findItem.itemName,
                    size:"S"
                })
            }
            if(currItem.m > 0){
                currItemArr.push({
                    quantity: currItem.m,
                    id: Math.random()*10000000000000000,
                    sku: `${findItem.item}-M`,
                    name: findItem.itemName,
                    size:"M"
                })
            }
            if(currItem.l > 0){
                currItemArr.push({
                    quantity: currItem.l,
                    id: Math.random()*10000000000000000,
                    sku: `${findItem.item}-L`,
                    name: findItem.itemName,
                    size:"L"
                })
            }
            if(currItem.xl > 0){
                currItemArr.push({
                    quantity: currItem.xl,
                    id: Math.random()*10000000000000000,
                    sku: `${findItem.item}-XL`,
                    name: findItem.itemName,
                    size:"XL"
                })
            }
            markedArr.push(...currItemArr)
        })
        setMarkedItems(markedArr)
        setMarkedItemsId(state.selection)
        setMarkedItemCount(state.selection.length)
        return
      }

      const handleOrderStatusUpdate = async() => {
          const payload ={
              factoryOrder: info.id,
              status: updateFactoryStatus
          }
          await dispatch(updateFactoryOrderStatus(payload))
          await reloadInfo()
        //   console.log("lineItems:  ", lineItems)
        }
        
        const handleItemStatusUpdate = async() => {
        //   console.log("lineItems:  ", lineItems)
          markedItemsId.forEach(async(ele)=>{
              const payload ={
                  lineItem: ele,
                  status: updateItemStatus
              }
              await dispatch(updateLineItemStatus(payload))
          })
          const updatedFactoryInfo = await dispatch(getAllVendorOrders())
          const currInfo = updatedFactoryInfo.find(x => x.id == info.id )
          setLineItems([...currInfo.LineItems])
        //   console.log("this is info:   ", updatedFactoryInfo)
      }

      const updateAfterEmail = async(status) => {
          const payload ={
              factoryOrder: info.id,
              status: status
          }
          await dispatch(updateFactoryOrderStatus(payload))
          await reloadInfo()
        //   console.log("lineItems:  ", lineItems)
        }


    const sendEmailMessage = async() => {
        setDisableSubmit(true)
        const formData = new FormData()
        if(poAttach){
            const getFactoryPOElement = await document.getElementById("factory-purchase-order")
            const base64Data = await htmlPDFBase64(getFactoryPOElement, `${factoryName} - PO#${factoryPO} - Packing List`)
            formData.append("factoryPO",base64Data)
            formData.append("filenamePO",`${factoryName} - PO#${factoryPO}`)
        }
        if(plAttach){
            const getShopifyPOElement = await document.getElementById("packing-list")
            const base64Data = await htmlPDFBase64(getShopifyPOElement, `Shopify #${shopifyOrderNumber} - Packing List`)
            formData.append("packingList",base64Data)
            formData.append("filenamePL", `Shopify #${shopifyOrderNumber} - Packing List`)
        }
        formData.append("attachFactoryPO",poAttach)
        formData.append("attachPackingList", plAttach)
        formData.append("to",factoryEmail)
        formData.append("subject", subject)
        formData.append("text", body)
        const msgRes = await dispatch(sendEmail(formData))
        setUpdateFactoryStatus("Submitted")
        updateAfterEmail("Submitted")
        setDisableSubmit(false)
        setOpenSendEmail(false)
      }

    return(
        <Grid container >
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js"></script>
            <ThemeProvider theme={theme}> 
                <Paper sx={{width:"100%"}}>
                    <Grid container  >
                        <Grid item xs={12} sx={{backgroundColor:"#14213D", p:2}}> 
                            <Typography variant="h5">Factory Order - PO #{info.factoryPO} </Typography>
                        </Grid>
                    </Grid>

                    {/* CUSTOMER INFO SECTION */}
                    <Grid container sx={{p:2}} spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h6' sx={{fontWeight:600}}>General Information</Typography>
                        </Grid>
                        <Grid container item xs={10} justifyContent='space-between'>
                            <Grid item xs={"auto"}>
                                <Typography variant='body1' sx={{fontWeight:600}}>#{shopifyOrderNumber} - {customerName}</Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant='body1' sx={{fontWeight:600}}>{factoryPODate}</Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant='body1' sx={{fontWeight:600}}>{shipMethod == true ? "Ships to Customer" : "Ships to Dolcessa"}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>


                    {/* LINE ITEM AREA */}
                    <Grid container sx={{p:2}} spacing={2}>
                        <Grid item xs={12} sx={{height:400, width:"100%"}}>
                            <DataGrid 
                                columns={columns}
                                rows={lineItems}
                                checkboxSelection
                                hideFooterPagination
                                onStateChange={handleUpdateState}
                            />
                        </Grid>
                    </Grid>

                    {/* Update Status Area */}
                    <Grid container sx={{p:2}} spacing={2}>
                        <Grid item xs={6} container alignItems='center'>
                            <Grid item xs={12} >
                                <Typography variant='h6' sx={{fontWeight:600}}>Update Order Status</Typography>
                            </Grid>
                            <Grid item xs={6} sx={{pr:2}}>
                                <Select fullWidth value={updateFactoryStatus} onChange={(e)=>setUpdateFactoryStatus(e.target.value)} >
                                    <MenuItem value="Submitted" id="Submitted">Submitted</MenuItem>
                                    <MenuItem value="Complete" id="Complete">Complete</MenuItem>
                                    <MenuItem value="Canceled" id="Canceled">Canceled</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={6}>
                                <Button onClick={handleOrderStatusUpdate} color='button2' variant='outlined'>Update</Button>
                            </Grid>
                        </Grid>

                        <Grid item xs={6} container alignItems='center'>
                            <Grid item xs={12}>
                                <Typography variant='h6' sx={{fontWeight:600}}>Update Status for {markedItemCount} Item{markedItemCount == 1 ? "" : "s"} </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{pr:2}}>
                                <Select fullWidth value={updateItemStatus} onChange={(e)=>setUpdateItemStatus(e.target.value)} >
                                    <MenuItem value="Submitted" id="Submitted">Submitted</MenuItem>
                                    <MenuItem value="Complete" id="Complete">Complete</MenuItem>
                                    <MenuItem value="Canceled" id="Canceled">Canceled</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={6}>
                                <Button onClick={handleItemStatusUpdate} color='button2' variant='outlined'>Update</Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* GENERATE DOCUMENTS */}
                    <Grid container sx={{p:2}} spacing={2}>
                        <Grid item xs={4} container>
                            <Grid item xs={12} container>
                                <Typography variant='h6' >Packing List Documents</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <PackingList  orderNumber={shopifyOrderNumber} items={markedItems} type="view" notes={customerNotes} />
                            </Grid>
                            <Grid item xs={12}>
                                <PackingList  orderNumber={shopifyOrderNumber} items={markedItems} type="download" notes={customerNotes} />
                            </Grid>
                        </Grid>
                        <Grid item container xs={4}>
                            <Grid item xs={12} container>
                                <Typography variant='h6' >Factory Documents</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FactoryPO allItems={itemName} factoryInformation={factoryInformation} shipTo={shipAddy} orderNumber={shopifyOrderNumber} items={lineItems} type="view" notes={customerNotes} />
                            </Grid>
                            <Grid item xs={12}>
                                <FactoryPO allItems={itemName} factoryInformation={factoryInformation} shipTo={shipAddy} orderNumber={shopifyOrderNumber} items={lineItems} type="download" notes={customerNotes} />
                            </Grid>
                        </Grid>
                        <Grid item container xs={4}>
                            <Grid item xs={12} container>
                                <Typography variant='h6' >Notify Factory</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <ThemeProvider theme={theme}>
                                    <Typography onClick={()=>setOpenSendEmail(true)}  variant='body1' sx={{fontWeight:600, cursor:"pointer",'&:hover':{color:"blue"}}}>Email Factory</Typography>
                                </ThemeProvider>
                            </Grid>
                        </Grid>
                       
                    </Grid>


                    {/* <Grid container justifyContent="center">
                        <Grid item xs={4} sx={{p:2}}>
                            <Button color="button2" variant="outlined" onClick={handleCloseModal} fullWidth>close</Button>
                        </Grid>
                        <Grid item xs={4} sx={{p:2}}>
                            <Button color="primary" style={{backgroundColor:"#FCA311"}} variant="contained" fullWidth>Update</Button>
                        </Grid>
                    </Grid> */}
                </Paper>
                <Dialog open={openSendEmail} onClose={()=>setOpenSendEmail(false)} fullWidth maxWidth='sm'>
                    <Grid container sx={{p:2}} spacing={3}>
                        
                        <Grid item xs={6}>
                            <InputLabel>To</InputLabel>
                            <TextField value={factoryEmail} onChange={(e)=>setFactoryEmail(e.target.value)} fullWidth/>
                        </Grid>
                        <Grid container></Grid>
                        <Grid item xs={6}>
                            <InputLabel>Subject</InputLabel>
                            <TextField value={subject} onChange={(e)=>setSubject(e.target.value)} fullWidth/>
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel>Attachments</InputLabel>
                            <Grid container alignItems='center' sx={{height:"75%"}}>
                                <Grid item xs={6}>
                                    <Typography sx={{cursor:"pointer", color:poAttach == false ? "gray": '#FCA311', fontWeight:"bold"}} onClick={()=>setPoAttach(!poAttach)} >Factory PO</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{cursor:"pointer", color:plAttach == false ? "gray": '#FCA311', fontWeight:"bold"}} onClick={()=>setPlAttach(!plAttach)} >Packing List</Typography>
                                </Grid>
                                
                            </Grid>
                        </Grid>
                        <Grid container></Grid>
                        <Grid item xs={12}>
                            <InputLabel>Body</InputLabel>
                            <TextField value={body} onChang={(e)=>setBody(e.target.value)} multiline rows={4} fullWidth/>
                        </Grid>
                        <Grid container justifyContent='center' sx={{pt:2}}>
                            <Grid item xs={3}>
                                <Button disabled={disableSubmit} color='button2' variant='contained' fullWidth onClick={sendEmailMessage} >Submit</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Dialog>
            </ThemeProvider>
        </Grid>
    )
}

export default FactoryOrderModal