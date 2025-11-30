import { orderService } from "../../services/order/order.service.local";
import { makeId } from "../../services/util.service";
import { SET_ORDERS, ADD_ORDER, REMOVE_ORDER, SET_ORDER, UPDATE_ORDER, UPDATE_ORDER_STATUS, ADD_ORDER_MSG } from "../reducers/order.reducer";
import { store } from "../store";


export async function loadOrders(filterBy){
    try {
        const orders = await orderService.query(filterBy)
        store.dispatch({type: SET_ORDERS, orders})
    }
    catch(err) {
        console.log('Cannot load orders');
        throw err   
    }
}

export async function loadOrder(orderId){
    try {
        const order = await orderService.getById(orderId)
        store.dispatch({type: SET_ORDER, order})
    }
    catch(err) {
        console.log('Cannot load order');
        throw err        
    }
}

export async function removeOrder(orderId) {
    try {
        await orderService.remove(orderId)
        store.dispatch({type: REMOVE_ORDER, orderId})
    }
    catch(err) {
        console.log('Cannot remove order');
        throw err        
    }
}

export async function addOrder(order) {
    try {
        const savedOrder = await orderService.save(order)
        store.dispatch({type: ADD_ORDER, savedOrder})
        return savedOrder
    }
    catch(err) {
        console.log('Cannot add order');
        throw err       
    }
}

export async function updateOrder(order) {
    try {
        const savedOrder = await orderService.save(order)
        store.dispatch({type: UPDATE_ORDER, savedOrder})
        return savedOrder
    }
    catch(err) {
        console.log('Cannot update order');
        throw err       
    } 
}

export async function updateOrderStatus(orderId, status) {
    try {
        const order = await orderService.getById(orderId)
        order.status = status
        const savedOrder = await orderService.save(order)
        store.dispatch({type: UPDATE_ORDER_STATUS, orderId, status})
        return savedOrder
    }
    catch(err) {
        console.log('Cannot update order status');
        throw err        
    }
}

export async function addOrderMsg(orderId, txt, by) {
    try {
        const order = await orderService.getById(orderId)
        const msg = {
            id: makeId(),
            by,
            txt,
            createAt: Date.now()
        }
        order.msgs.push(msg)
        await orderService.save(order)
        store.dispatch({type: ADD_ORDER_MSG, msg})
        return msg
    }
    catch(err){
        console.log('Cannot add order message', err);
        throw err
    }
    
}