import * as actionTypes from './actions'

const initialState = {
    user: null
}

const userAuthReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_USER_AUTH:
            return {
                ...state,
                user: action.user
            }
        default:
            return state;
    }
}

export default userAuthReducer;