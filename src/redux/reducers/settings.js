import * as types from '../types'

const initialState = {
    isRegion: false,
    indexed: false,
}

function settingsReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.SWITCH_IS_REGION: {
            return {
                ...state,
                isRegion: action.isRegion,
            }
        }
        case types.SWITCH_INDEXED: {
            return {
                ...state,
                indexed: action.indexed,
            }
        }
        default: {
            return state
        }
    }
}

export default settingsReducer
