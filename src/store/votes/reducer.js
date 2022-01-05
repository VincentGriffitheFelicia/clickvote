import * as actionTypes from './actions'

const initialState = { }

const votesReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_VOTES:
            return action.votes
        default:
            return state
    }
}

export default votesReducer