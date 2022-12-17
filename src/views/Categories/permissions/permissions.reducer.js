import { ADD_ROLE, UPDATE_ROLE, DELETE_ROLE, GET_ROLE, SET_LOADER_ROLE, REMOVE_LOADER_ROLE, GET_ROLES, BEFORE_ROLE, GET_PERMISSION, BEFORE_PERMISSION } from '../../../redux/types';

const initialState = {
    addRoleRes: {},
    updateRoleRes: {},
    deleteRoleRes: {},
    getRolesRes: {},
    getRoleRes: {},
    authenticate: false,  // called API state

    permission: {},
    authPermission: false,
    roleLoader: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_ROLE:
            return {
                ...state,
                addRoleRes: action.payload,
                authenticate: true,
            }
        case UPDATE_ROLE:
            return {
                ...state,
                updateRoleRes: action.payload,
                authenticate: true,
            }
        case DELETE_ROLE:
            return {
                ...state,
                deleteRoleRes: action.payload,
                authenticate: true,
            }
        case GET_ROLES:
            return {
                ...state,
                getRolesRes: action.payload,
                authenticate: true,
            }
        case GET_ROLE:
            return {
                ...state,
                getRoleRes: action.payload,
                authenticate: true,
            }
        case GET_PERMISSION:
            return {
                ...state,
                permission: action.payload,
                authPermission: true,
            }
        case BEFORE_PERMISSION:
            return {
                ...state,
                authPermission: false,
            }
        // case SET_LOADER_ROLE:
        //     return {
        //         ...state,
        //         roleLoader: true,
        //     }
        // case REMOVE_LOADER_ROLE:
        //     return {
        //         ...state,
        //         roleLoader: false,
        //     }
        case BEFORE_ROLE:
            return {
                ...state,
                addRoleRes: {},
                updateRoleRes: {},
                deleteRoleRes: {},
                getRolesRes: {},
                getRoleRes: {},
                authenticate: false
            }
        default:
            return state;
    }
}