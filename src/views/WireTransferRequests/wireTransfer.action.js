import { GET_REQUESTS, BEFORE_REQUEST, MANAGE_REQUEST, GET_ERRORS, BEFORE_MANAGE_REQUEST,GET_WIRE_REQUESTS,BEFORE_WIRE_REQUEST,GET_WIRE_REQUEST,UPDATE_WIRE_REQ } from '../../redux/types'
import { toast } from 'react-toastify';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from '../../config/config';

export const beforeWireRequest = () => {
    return {
        type: BEFORE_WIRE_REQUEST
    }
}
export const getWireRequests = (qs = '', body = {}) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}wirerequests/list`;
    if (qs)
        url += `?${qs}`
    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
        },
        // body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            console.log("3", data)
            toast.success(data.message, {
                toastId: "req-success"
            })
            dispatch({
                type: GET_WIRE_REQUESTS,
                payload: data.data
            })
        } else {
            toast.error(data.message, {
                toastId: "req-error"
            })
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const getWireRequest = (requestId) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}wirerequests/get/${requestId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_WIRE_REQUEST,
                payload: data.request
            })
        } else {
            if (qs !== '')
                toast.error(data.message, {
                    toastId: "error"
                })
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message, {
                    toastId: "users-stats-error"
                })
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const updateWireRequest = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}wirerequests/update`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'Content-Type': "application/json"
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message, { toastId : 'update-kyc-success'})
            dispatch({
                type: UPDATE_WIRE_REQ
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

