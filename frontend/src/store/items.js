import {fetch} from "./csrf"
export const LIST_ITEMS = "./items/LIST_ITEMS"
export const LIST_CATEGORIES = "./items/LIST_CATEGORIES"

const listItems = (Items) => ({
    type: LIST_ITEMS,
    Items
})

const listCategories = (Categories) => ({
    type: LIST_CATEGORIES,
    Categories
})

export const getItems = () => async(dispatch) => {
    const res = await fetch('/api/products/',{
        method:"GET"
    })
    dispatch(listItems(res.data))
    dispatch(listCategories(res.data.allCategories))
    return res.data
}
// export const getItems = () => async(dispatch) => {
//     const res = await fetch('/api/items/',{
//         method:"POST"
//     })
//     dispatch(listItems(res.data))
//     return
// }

export const getCategories = () => async(dispatch) => {
    const res = await fetch('/api/products/my-categories',{
        method:"GET"
    })
    dispatch(listCategories(res.data.currentCategories))
    return res.data
}

export const addCategories = (payload) => async(dispatch) => {
    const res = await fetch('/api/products/create-category',{
        method:"POST",
        body: JSON.stringify(payload)
    })
    dispatch(listCategories(res.data))
    return
}

export const createItem = (payload) => async(dispatch) => {
    const res = await fetch('/api/products/create',{
        method:"POST",
        body: JSON.stringify(payload)
    })
    return res
}

export const addItems = (newItemPayload, variant) => async(dispatch) => {
   const res = await fetch('/api/products', {
       method: "POST",
       body: JSON.stringify(newItemPayload)
   })
   const variantPayload = []
   variant.forEach(ele=>{
       const eleVariant = {
           size: ele.size,
           variantSKU: ele.variantSKU,
           itemId: res.data[0].id
       }
       variantPayload.push(eleVariant)
   })
   const itemId = res.data[0].id
   const res2 = await fetch('/api/products/variant',{
       method:"POST",
       body: JSON.stringify({variantPayload, itemId})
   })
   const allItems = res2.data
   dispatch(listItems(allItems))
}

const initialState = {
    Items: [],
    Categories: [],
}

const itemReducer = (state = initialState, action) => {
    switch(action.type) {
        case LIST_ITEMS: {
            return{
                ...state,
                Items: action.Items
            }
        }
        case LIST_CATEGORIES: {
            return{
                ...state,
                Categories: action.Categories
            }
        }
        default:
            return state
    }
}
export default itemReducer