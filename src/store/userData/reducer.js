import * as actionTypes from './actions'

const initialState = {
    user: null,
    unsubscribe: null,
}

const userDataReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_USER_DATA:
            return {
                ...state,
                user: action.user
            }
        case actionTypes.SET_USER_DATA_UNSUBSCRIBE:
            return {
                ...state,
                unsubscribe: action.unsubscribe
            }
        default:
            return state;
    }
}

export default userDataReducer;