import { toast } from 'react-toastify';
import { GET_SETTINGS, EDIT_SETTINGS, BEFORE_SETTINGS, GET_ERRORS,EDIT_BANK_DETAILS,GET_BANK_DETAILS } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeSettings = () => {
    return {
        type: BEFORE_SETTINGS
    }
}

export const getSettings = () => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}settings/get`;

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: GET_SETTINGS,
                payload: data.settings
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
                toast.error(data.message, {
                    toastId: "settings-stats-error"
                  })
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const editSettings = (body, qs = '',) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}settings/edit`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message, { toastId : 'settings-updated'})
            dispatch({
                type: EDIT_SETTINGS,
                payload: data.settings
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


export const editBankDetails = (body) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}settings/editbankdetails`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'Content-Type': "application/json"
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message, { toastId : 'settings-updated'})
            dispatch({
                type: EDIT_BANK_DETAILS,
                payload: data.settings
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

export const getBankDetails = () => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}settings/getbankdetails`;

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: GET_BANK_DETAILS,
                payload: data.bankDetails
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
