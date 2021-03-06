import axios from 'axios'

import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, ACCOUNT_DELETED, RES_PASSWORD, REGISTER_SUCCESS, REGISTER_FAIL, USER_FAILED, USER_LOADED, FORGOT_PASSWORD_FAIL, FORGOT_PASSWORD } from './Types'


export const sendLogin = (formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(formData)
    try {
        const res = await axios.post('/api/users/login', body, config)
        console.log(res.data)
        const payload = {
            user: res.data,
            sponsor: res.data.sponsor
        }
        dispatch({
            type: LOGIN_SUCCESS,
            payload
        })
    } catch (err) {
        console.error(err.message)
            //DISPATCH ALERTS FOR ERRORS
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

export const registerUser = (userData, history) => async(dispatch) => {
    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    let body = JSON.stringify(userData);
    try {
        await axios.post('/api/users/register', body, config)
        dispatch({
            type: REGISTER_SUCCESS,
            payload: {
                registered: true
            }
        })
    } catch (error) {
        dispatch({
            type: REGISTER_FAIL
        })
        console.error(error.message);
    }
}

export const registerSponsor = (userData, history) => async(dispatch) => {
    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    let body = JSON.stringify(userData);
    try {
        console.log('reached action');
        await axios.post('/api/sponsors/register', body, config)
        dispatch({
            type: REGISTER_SUCCESS,
            payload: {
                registered: true
            }
        })
    } catch (error) {
        dispatch({
            type: REGISTER_FAIL
        })
        console.error(error.message);
    }
}

export const loadUser = () => async dispatch => {
    try {
        const res = await axios.get('/api/auth')
        const payload = {
            user: res.data,
            sponsor: res.data.sponsor
        }
        dispatch({
            type: USER_LOADED,
            payload
        })
    } catch (err) {
        dispatch({
            type: USER_FAILED
        })
        console.error(err.message);
    }
}

export const deleteRecipient = () => async dispatch => {
    try {
        await axios.delete('/api/users/')
        dispatch({
            type: ACCOUNT_DELETED
        })
    } catch (err) {
        console.error(err.message);
    }
}

export const logout = () => async dispatch => {
    try {
        await axios.get('/api/users/logout')
        dispatch({
            type: LOGOUT
        })
    } catch (err) {
        console.error(err.message);
    }
}

export const setAuthFalse = () =>  dispatch => {
    try {
        dispatch({
            type: LOGOUT
        })
    } catch (err) {
        console.error(err.message);
    }
}

export const forPass = (email) => async dispatch => {
    console.log('forpass hit')
    try {
        const res = await axios.get(`/api/auth/forgotpassword/${email}`)
        console.log(res)
        dispatch({
            type: FORGOT_PASSWORD
        })
    } catch (err) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL
        })
    }
}

export const resPass = (formData, jwt) => async dispatch => {
    console.log('respass hit')
    const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        //CHECK PASSWORDS?
    const password = formData.pass1
    const body = JSON.stringify({ password })

    try {
        await axios.post(`/api/auth/resetpassword/${jwt}`, body, config)
        dispatch({
            type: RES_PASSWORD
        })
    } catch (err) {
        console.log('did not work lmao')
    }
}