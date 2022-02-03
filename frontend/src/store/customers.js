import {fetch} from "./csrf"
export const LIST_PARENT_COMPANIES = "./customers/LIST_PARENT_COMPANIES"
export const LIST_PARENT_BRANCHES = "./customers/LIST_PARENT_BRANCHES"

const listCompanies = (ParentCompanies) => ({
    type: LIST_PARENT_COMPANIES,
    ParentCompanies
}) 

const listParentBranches = (ParentBranches) => ({
    type: LIST_PARENT_BRANCHES,
    ParentBranches
}) 

export const createContactInfo = (payload) => async(dispatch) => {
    const res = await fetch('/api/customer-order/contact-info',{method:"POST", body:JSON.stringify(payload)})
    const newInfo = await res.data
    return newInfo
}

export const createCustomerOrder = (payload) => async(dispatch) => {
    const res = await fetch('/api/customer-order/new-customer-order',{method:"POST", body:JSON.stringify(payload)})
    const newInfo = await res.data
    return newInfo
}

export const getCustomerAddress = (payload) => async(dispatch) => {
    const res = await fetch('/api/customer-order/customer-info',{method:"POST", body:JSON.stringify(payload)})
    const newInfo = await res.data
    return newInfo
}

export const listParentCompanies = () => async(dispatch) => {
    const res = await fetch('/api/customers/')
        await dispatch(listCompanies(res.data))
    return
}

export const listBranches = () => async(dispatch) => {
    const res = await fetch('/api/customers/branch')
        await dispatch(listParentBranches(res.data))
    return
}

export const addParentCompany = (payload, createBranch) => async(dispatch) => {
   const {
      companyName,
        repFirstName,
        repLastName,
        repPhoneNumber,
        repEmail,
        addressLine1,
        addressLine2,
        addressLine3,
        city,
        state,
        zipcode,
        country,
        retail,
        uniformProgram
    } = payload
    const res = await fetch('/api/customers/',
    {method:"POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
    }
    )
    if(createBranch == false){
        const getAllCustomers = await fetch("/api/customers")
            await dispatch(listCompanies(getAllCustomers.data))
        return
    }
    const parentCompany = res.data[0].id
    const branchName = res.data[0].companyName
    const payload2 = {
      companyName,
      repFirstName,
      repLastName,
      repPhoneNumber,
      repEmail,
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      state,
      zipcode,
      country,
      parentCompany,
      branchName,
      retail,
      uniformProgram
    };
    const setBranch = await fetch('/api/customers/branch',
    {method:"POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(payload2)
    }
    )
        await dispatch(listCompanies(setBranch.data))
    return 
}
export const addBranchLocation = (payload) => async(dispatch) => {
    const res = await fetch('/api/customers/branch',
    {method:"POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
    }
    )
        await dispatch(listCompanies(res.data))
    return
}

const initialState = {
    ParentCompanies: [],
    ParentBranches: [],
}

const customerReducer = (state = initialState, action) => {
    switch (action.type){
        case LIST_PARENT_COMPANIES: {
            return {
                ...state,
                ParentCompanies: action.ParentCompanies
            }
        }
        case LIST_PARENT_BRANCHES: {
            return {
                ...state,
                ParentBranches: action.ParentBranches
            }
        }
        default:
            return state
    }
}

export default customerReducer