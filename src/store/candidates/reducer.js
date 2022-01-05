import * as actionTypes from './actions'

const initialState = {
    loadedCandidateListId: null,
    list: null,
    listInformation: null,
    unsubscribe: null,
}

const candidatesReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_CANDIDATES: 
            return {
                ...state,
                loadedCandidateListId: action.loadedCandidateListId,
                list: action.candidates,
            }

        case actionTypes.SET_CANDIDATES_UNSUBSCRIBE:
            return {
                ...state,
                unsubscribe: action.unsubscribe,
            }    
        case actionTypes.VOTE_CANDIDATE:

            const candidatesCopy = [...state.list[action.position]]
            const index = candidatesCopy.findIndex(doc => doc.id === action.id)
            candidatesCopy[index].voted = !candidatesCopy[index].voted

            return {
                ...state,
                list: {
                    ...state.list,
                    [action.position]: candidatesCopy
                }
            }

        case actionTypes.SET_INFORMATION:
            return {
                ...state,
                listInformation: action.data
            }
            
        default: return state
    }
}

export default candidatesReducer