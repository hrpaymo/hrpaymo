import { combineReducers } from 'redux'
import { LOG_USER_OUT } from './actions'

function paymoo(state = {}, action) {
    switch (action.type) {
        case LOG_USER_OUT:
            return Object.assign({}, state, {
                isLoggedIn: false,
                globalFeed: {},
                userFeed: {},
                balance: null,
                userInfo: {}
            })
        default:
            return state
    }
}

function anything (state = {}, action) {
    switch (action.type) {
        case LOG_USER_OUT:
            return Object.assign({}, state, {
                isLoggedIn: false,
                globalFeed: {},
                userFeed: {},
                balance: null,
                userInfo: {}
            })
        default:
            return state
    }
}
const paymo = combineReducers({
    paymoo,
    anything
})

export default paymo