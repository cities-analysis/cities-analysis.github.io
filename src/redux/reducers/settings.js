import * as types from '../types'

const initialState = {
    isRegion: false,
    indexed: false,
    ciVersion: 'old',
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
        case types.SWITCH_CI_VERSION: {
            return {
                ...state,
                ciVersion: action.ciVersion,
            }
        }
        default: {
            return state
        }
    }
}

export default settingsReducer
