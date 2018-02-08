export const CLEAR_USER_SESSION = 'CLEAR_USER_SESSION'
export const REFRESH_SESSION = 'REFRESH_SESSION'
export const SET_USER_SESSION = 'SET_USER_SESSION'


export const setUserSession = user => ({ type: SET_USER_SESSION, user })


export const clearUserSession = () => ({ type: CLEAR_USER_SESSION, user: null })


export const refreshSession = () => ({ type: REFRESH_SESSION })
