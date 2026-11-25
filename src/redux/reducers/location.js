import * as types from '../types'

const initialState = {
    path: [],
}

function locationReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.LOCATION_CHANGED: {
            return {
                path: action.newLocation.split('/'),
            }
        }
        default: {
            return state
        }
    }
}

export default locationReducer
