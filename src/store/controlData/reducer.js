import * as actionTypes from './actions'

const initialState = {
    unsubscribe: null,
    currentCandidatesId: null,
    openForVoting: false,
    showResult: false,
    votingLimits: null,
}

const controlDataReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_CONTROL_DATA:
            return {
                ...action.controlData
            }
        case actionTypes.SET_CONTROL_DATA_UNSUBSCRIBE:
            return {
                ...state,
                unsubscribe: action.unsubscribe
            }
        default: return state
    }
}

export default controlDataReducer