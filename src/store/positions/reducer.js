import * as actionTypes from './actions'

const initialState = {
    president: {
        candidates: [],
        loaded: false,
        loadedCandidatesDocId: null,
    },
    vicePresident: {
        candidates: [],
        loaded: false,
        loadedCandidatesDocId: null,
    },
    secretary: {
        candidates: [],
        loaded: false,
        loadedCandidatesDocId: null,
    },
    treasurer: {
        candidates: [],
        loaded: false,
        loadedCandidatesDocId: null,
    },
    auditor: {
        candidates: [],
        loaded: false,
        loadedCandidatesDocId: null,
    },
    senator: {
        candidates: [],
        loaded: false,
        loadedCandidatesDocId: null,
    }
}

const candidatesReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_CANDIDATES: 
            return {
                ...state,
                [action.position]: {
                    ...state[action.position],
                    loadedCandidatesDocId: action.docId,
                    loaded: true,
                    candidates: action.candidates,
                }
            }
        case actionTypes.VOTE_CANDIDATE:

            const candidatesCopy = [...state[action.position].candidates]
            const index = candidatesCopy.findIndex(doc => doc.id === action.id)
            candidatesCopy[index].voted = !candidatesCopy[index].voted

            return {
                ...state,
                [action.position]: {
                    ...state[action.position],
                    candidates: candidatesCopy
                }
            }
            
        default: return state
    }
}

export default candidatesReducer