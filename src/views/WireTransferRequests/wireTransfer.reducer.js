import {GET_REQUESTS, BEFORE_REQUEST, MANAGE_REQUEST, BEFORE_MANAGE_REQUEST,GET_WIRE_REQUESTS,BEFORE_WIRE_REQUEST,GET_WIRE_REQUEST,UPDATE_WIRE_REQ} from '../../redux/types'

const initialState = {
    getRequestPagesRes: {},
    getWireRequestAuth: false,
    manageRequestAuth: false,
    updateWireRequestAuth: false,
    requestAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case BEFORE_WIRE_REQUEST:
            return {
                ...state,
                getWireRequestAuth: false,
                updateWireRequestAuth: false,
                requestAuth: false
            }
        case GET_WIRE_REQUESTS:
            return {
                ...state,
                getWireRequestsList : action.payload,
                getWireRequestAuth: true,
            }
        case UPDATE_WIRE_REQ:
            return {
                ...state,
                updateWireRequestAuth: true
            }
        case GET_WIRE_REQUEST:
            return {
                ...state,
                request : action.payload,
                requestAuth: true,
            }
        case MANAGE_REQUEST:
            return {
                ...state,
               manageRequestAuth: true
            }
        default:
            return {
                ...state
            }
    }
}